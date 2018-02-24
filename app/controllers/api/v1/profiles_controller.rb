class Api::V1::ProfilesController < Api::V1::ApplicationController
  before_action :require_login, only: [:update]

  def index
    profiles = Profile.where(featured: true)

    if stale? etag: profiles, last_modified: profiles.pluck(:updated_at).max.utc
      render json: ProfileSerializer.new(profiles).serializable_hash
    end
  end

  def discover
    interested_in_sexes = []
    
    if current_user.present?
      interested_in_sexes = current_user.interested_in_sexes
    else
      interested_in_sexes = ['male', 'female', 'other']
      if params[:interested_in_men] != 'true'
        interested_in_sexes.delete('male')
      end

      if params[:interested_in_women] != 'true'
        interested_in_sexes.delete('women')
      end

      if params[:interested_in_other] != 'true'
        interested_in_sexes.delete('other')
      end
    end

    sex = current_user.try(:sex) || params[:sex]

    profiles_query = Profile
      .joins(:user)
      .real
      .where(visible: true)
    
    if sex.present?
      profiles_query = profiles_query.where(users: { sex: interested_in_sexes }).interested_in(sex)
    end
      
    profiles_query = profiles_query
      .where.not(profiles: { id: Array(params[:exclude]) })
      .order("updated_at DESC")

    render_profile(profiles_query.first)
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

      if !update_params[:social_links].nil?
        social_links = ExternalAuthentication.update_social_links(
          update_params[:social_links]
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

  def render_profile(profile)
    if profile.nil?
      render json: ProfileSerializer.new(profile).serializable_hash
    elsif current_user.present? && profile.try(:user_id) == current_user.id
      render json: PrivateProfileSerializer.new(profile).serializable_hash
    else
      if stale? etag: profile, last_modified: profile.updated_at.utc
        render json: ProfileSerializer.new(profile).serializable_hash
      end
    end
  end

  def update_params
    params
      .require(:profile)
  end
end