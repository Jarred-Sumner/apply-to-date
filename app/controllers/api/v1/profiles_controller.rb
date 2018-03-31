class Api::V1::ProfilesController < Api::V1::ApplicationController
  before_action :require_login, only: [:update, :shuffle]

  def index
    if current_user.present?
      @profiles = Profile.visible.featured.sexually_compatible_with(current_user.profile)
    end

    @profiles = Profile.visible.featured if @profiles.blank?

    if stale? etag: @profiles, last_modified: @profiles.pluck(:updated_at).max.try(:utc)
      render json: ProfileSerializer.new(@profiles).serializable_hash
    end
  end

  def photo
    profile = Profile.find_by!(visible: true, id: params[:id])

    if profile.photos.present?
      redirect_to profile.photos.first
    else
      render_error(message: "No photos", status: 404)
    end
  end

  def shuffle
    exclude_profile_list = Array(params[:exclude])
      .concat(Application.where(applicant_id: current_user.id).pluck(:profile_id))

    exclude_user_list = [current_user.id]
      .concat(BlockUser.where(blocked_by_id: current_user.id).pluck(:blocked_user_id))
      .concat(BlockUser.where(blocked_user_id: current_user.id).pluck(:blocked_by_id))
      .concat(Application.where(user_id: current_user.id).where("applicant_id IS NOT NULL").pluck(:applicant_id))

    viewed_counts = current_user
      .viewed_users
      .pluck(:profile_id, :view_count, :last_viewed_at)
      .map { |result| [result[0], [result[1], result[2]] ] }
      .to_h

    profile = Profile
      .discoverable
      .where.not(id: exclude_profile_list)
      .where.not(user_id: exclude_user_list)
      .compatible_with(current_user.profile)
      .filled_out
      .to_a
      .shuffle
      .sort_by do |profile|
        viewed_counts[profile.id] || [0, 0]
      end
      .first

    if profile.present?
      current_user.increment_shuffle_session!
    end

    if current_user.shuffle_allowed?
      render_profile(profile, false, {shuffle_disabled: false})
    else
      render_profile(current_user.profile, false, {shuffle_disabled: true, shuffle_disabled_until: current_user.shuffle_disabled_until})
    end
  end

  def show
    if current_user.try(:username) == params[:id]
      profile = Profile.includes(:external_authentications).find_by(id: params[:id])

      render json: PrivateProfileSerializer.new(profile, {
        include: [:external_authentications]
      }).serializable_hash
    else
      profile = Profile.where(visible: true).find_by(id: String(params[:id]))
      render_profile(profile)
    end
  end

  def update
    profile = current_user.profile

    ActiveRecord::Base.transaction do
      if Array(update_params[:tags]).present?
        profile.update!(tags: Array(update_params[:tags]))
      end

      if update_params[:sections].present?
        sections = update_params[:sections].permit(Profile::DEFAULT_SECTIONS).to_unsafe_h.map { |k, v| [k, v.strip] }.to_h
        profile.update!(sections: sections)
      end

      if !update_params[:name].nil?
        profile.update!(name: String(update_params[:name]))
      end

      if !update_params[:tagline].nil?
        profile.update!(tagline: update_params[:tagline])
      end

      if !update_params[:interested_in_men].nil?
        profile.update!(interested_in_men: String(update_params[:interested_in_men]) == 'true')
      end

      if !update_params[:interested_in_women].nil?
        profile.update!(interested_in_women: String(update_params[:interested_in_women]) == 'true')
      end

      if !update_params[:interested_in_other].nil?
        profile.update!(interested_in_other: String(update_params[:interested_in_other]) == 'true')
      end

      if User::VALID_SEXES.include?(update_params[:sex])
        profile.update!(sex: update_params[:sex])
      end

      if !update_params[:photos].nil?
        photos = Array(update_params[:photos])

        # Ensure Photo URLs are valid
        begin
          photos.each do |photo|
            URI.parse(URI.encode(photo))
          end
        rescue URI::InvalidURIError
          raise ArgumentError.new("Please re-upload your photos and try again")
        end

        profile.update(photos: photos)
      end

      if !update_params[:external_authentications].nil?
        profile.verified_networks.destroy_all
        authentications = ExternalAuthentication.where(id: Array(update_params[:external_authentications]))
        authentications.each do |auth|
          VerifiedNetwork.create!(profile_id: profile.id, external_authentication: auth)
        end
      end

      if !update_params[:phone].nil?
        profile.update!(phone: String(update_params[:phone]))
      end

      if !update_params[:recommended_contact_method].nil?
        profile.update!(recommended_contact_method: String(update_params[:recommended_contact_method]))
      end

      if !params[:profile][:social_links].nil?
        social_links = ExternalAuthentication.update_social_links(
          params[:profile][:social_links].to_unsafe_h
        )

        profile.update!(social_links: social_links)
      end

      if !update_params[:visible].nil?
        visible = String(update_params[:visible]) == 'true'
        profile.update!(visible: visible)
      end
    end

    render_profile(profile)
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  rescue ArgumentError => e
    render_error(message: e.message)
  end

  def render_profile(profile, etags_allowed = true, meta = {})
    if profile.nil?
      render json: ProfileSerializer.new(nil, meta).serializable_hash
    elsif current_user.present? && profile.try(:user_id) == current_user.id
      render json: PrivateProfileSerializer.new(profile, {meta: meta}).serializable_hash
    elsif etags_allowed
      if stale? etag: profile, last_modified: profile.updated_at.utc
        render json: ProfileSerializer.new(profile, {meta: meta}).serializable_hash
      end
    else
      render json: ProfileSerializer.new(profile, {meta: meta}).serializable_hash
    end
  end

  def update_params
    params
      .require(:profile)
  end
end