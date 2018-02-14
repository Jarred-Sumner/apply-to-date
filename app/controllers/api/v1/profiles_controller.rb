class Api::V1::ProfilesController < Api::V1::ApplicationController
  before_action :require_login, only: [:update]

  def index
    profiles = Profile.where(featured: true)

    render json: ProfileSerializer.new(profiles).serializable_hash
  end

  def show
    if current_user.try(:username) == params[:id]
      profile = Profile.includes(:external_authentications).find(params[:id])

      render json: PrivateProfileSerializer.new(profile, {
        include: [:external_authentications]
      }).serializable_hash
    else
      profile = Profile.where(visible: true).find(params[:id])
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
        sections = update_params[:sections].permit(Profile::DEFAULT_SECTIONS)
        profile.update!(sections: sections)
      end

      if !update_params[:name].nil?
        if update_params[:name].blank?
          raise ArgumentError.new("Please include your name")
        end

        profile.update!(name: String(update_params[:name]))
      end

      if !update_params[:tagline].nil?
        if update_params[:tagline].blank?
          raise ArgumentError.new("Please include a TLDR beneath your name")
        end

        profile.update!(tagline: update_params[:tagline])
      end


      if !update_params[:photos].nil?
        photos = Array(update_params[:photos])
        if photos.blank?
          raise ArgumentError.new("Please add at least one photo")
        end

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

      if !update_params[:social_links].nil?
        social_links = ExternalAuthentication.update_social_links(
          update_params[:social_links]
        )
        profile.update!(social_links: social_links)
      end

      if !update_params[:visible].nil?
        profile.update!(visible: String(update_params[:visible]) == 'true')
      end
    end

    render_profile(profile)
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end

  def render_profile(profile)
    if current_user.present? && profile.user_id == current_user.id
      render json: PrivateProfileSerializer.new(profile).serializable_hash
    else
      render json: ProfileSerializer.new(profile).serializable_hash
    end
  end

  def update_params
    params
      .require(:profile)
  end
end