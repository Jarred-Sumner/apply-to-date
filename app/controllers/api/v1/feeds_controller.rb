class Api::V1::FeedsController < Api::V1::ApplicationController
  before_action :require_external_authentication

  def show
    if params[:provider] == 'instagram'
      body = {
        data: external_authentication.instagram.recent_posts[:data],
        profile: external_authentication.instagram.profile[:data]
      }

      if body[:data].blank? || body[:profile].blank?
        return not_found
      end

      render json: body
    elsif params[:provider] == 'twitter'
      timeline = external_authentication.twitter.user_timeline(@external_authentication.username)
      if tweet = timeline.try(:first)
        if tweet.user.protected?
          render_error(message: "No #{params[:provider]} associated with #{params[:profile_id] || 'application'} on Apply to Date")
          return
        end
      end

      render json: {
        data: timeline
      }
    else
      render_error(message: "provider must be either instagram or twitter")
    end
  rescue JSON::ParserError => e
    render_error(message: "Failed to get posts")
  rescue ActiveRecord::RecordNotFound, Twitter::Error::Unauthorized => e
    not_found
  end

  private def not_found
    render_error(message: "No #{params[:provider]} associated with #{params[:profile_id] || 'application'} on Apply to Date")
  end

  private def show_params
    params.permit(:profile_id, :provider)
  end

  private def require_external_authentication
    if params[:profile_id].blank? && params[:application_id].blank?
      return render_error(message: "Profile or application is required")
    end

    if external_authentication.nil?
      render_error(message: "No #{params[:provider]} associated with #{params[:profile_id] || 'application'} on Apply to Date")
    end
  end

  private def external_authentication
    return @external_authentication if @external_authentication.present?

    profile_id = params[:profile_id]

    if params[:application_id].present?
      application = current_user.received_applications.find(params[:application_id])

      if application.social_links[params[:provider]].blank?
        return render_error(message: "No #{params[:provider]} associated with application on Apply to Date")
      end

      profile_id ||= application.try(:applicant).try(:username)

      @external_authentication = application.external_authentications.find_by(provider: params[:provider])
    end

    if profile_id.present? && !@external_authentication
      profile = Profile.visible.find(profile_id)

      if profile.social_links[params[:provider]].blank?
        return render_error(message: "No #{params[:provider]} associated with #{profile_id} on Apply to Date")
      end

      @external_authentication = profile.external_authentications.find_by(provider: params[:provider])
    end

    @external_authentication
  end
end