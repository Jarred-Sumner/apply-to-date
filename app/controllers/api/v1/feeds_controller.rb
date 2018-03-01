class Api::V1::FeedsController < Api::V1::ApplicationController

  def show
    if params[:profile_id].blank? && params[:application_id].blank?
      return render_error(message: "Profile or application is required")
    end

    if params[:profile_id].present?
      profile = Profile.visible.find(params[:profile_id])

      if profile.social_links[params[:provider]].blank?
        return render_error(message: "No #{params[:provider]} associated with #{params[:profile_id]} on Apply to Date")
      end

      @external_authentication = profile.external_authentications.find_by!(provider: params[:provider])
    elsif params[:application_id].present?
      application = current_user.received_applications.find(params[:application_id])

      if application.social_links[params[:provider]].blank? && !application.external_authentications.where(provilder: params[:provider]).exists?
        return render_error(message: "No #{params[:provider]} associated with application on Apply to Date")
      end

      @external_authentication = application.external_authentications.find_by!(provider: params[:provider])
    end

    if params[:provider] == 'instagram'
      render json: {
        data: @external_authentication.instagram.recent_posts[:data],
        profile: @external_authentication.instagram.profile[:data]
      }
    elsif params[:provider] == 'twitter'
      timeline = @external_authentication.twitter.user_timeline(@external_authentication.username)
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
  rescue ActiveRecord::RecordNotFound => e
    render_error(message: "No #{params[:provider]} associated with #{params[:profile_id] || 'application'} on Apply to Date")
  end

  private def show_params
    params.permit(:profile_id, :provider)
  end
end