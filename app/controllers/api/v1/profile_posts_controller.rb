class Api::V1::ProfilePostsController < Api::V1::ApplicationController
  before_action :verify_username, :verify_photos, only: :create_profile

  def editable_profiles
    @editable_profiles ||= session.fetch(:allow_editing_profiles) { [] }
  end

  def allow_editing_profile!(profile)
    editable_profiles.push(profile.id)

    session[:allow_editing_profiles] = editable_profiles
  end

  def can_edit_profile?(username)
    return false if username.blank?
    editable_profiles.include?(username)
  end

  def verify_photos
    if profile_params[:photos].present?
      photos = Array(profile_params[:photos])

      begin
        photos.each do |photo|
          URI.parse(URI.encode(photo))
        end
      rescue URI::InvalidURIError
        return render_error(message: "Please re-upload your photos and try again")
      end
    end
  end

  def verify_username
    username = String(profile_params[:username])

    if User.blacklisted_username?(username)
      return render_error(message: "Please choose a different username :)")
    elsif username.include?(" ")
      return render_error(message: "Please don't include a space in your username :)")
    elsif username.include?("#")
      return render_error(message: "Please don't include a # in your username :)")
    elsif username.include?("!")
      return render_error(message: "Please don't include a ! in your username :)")
    elsif username.include?("?")
      return render_error(message: "Please don't include a ? in your username :)")
    elsif username.include?("/")
      return render_error(message: "Please don't include a slash in your username :)")
    elsif username.blank?
      return render_error(message: "Please enter a username")
    end
  end

  def create_profile
    social_links = ExternalAuthentication.update_social_links(
      profile_params[:social_links].to_unsafe_h
    )
    photos = Array(profile_params[:photos] || [])
    username = String(profile_params[:username])

    profile = nil
    if !Profile.where(id: username).exists?
      profile = Profile.create!(social_links: social_links, photos: photos, id: username, visible: false, claimed: false)
      allow_editing_profile!(profile)
      render json: ProfileSerializer.new(profile, {include: [:profile_posts]}).serializable_hash
    elsif can_edit_profile?(username)
      profile = Profile.find(username)
      update_hash = {}
      update_hash[:photos] = photos if photos != profile.photos
      update_hash[:social_links] = photos if photos != profile.social_links
      profile.update!(update_hash)

      render json: ProfileSerializer.new(profile, {include: [:profile_posts]}).serializable_hash
    else
      render_forbidden
      return
    end
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end

  def create
    username = String(params[:username])
    return render_error(message: "Profile not found") if Profile.find_by(id: username).nil?

    profile_post = ProfilePost.create!({
      author_name: profile_post_params[:author_name],
      author_photo: profile_post_params[:author_photo],
      body: profile_post_params[:body],
      profile_id: username,
      author: current_user,
      visible: can_edit_profile?(username)
    })

    render json: ProfilePostSerializer.new(profile_post).serializable_hash
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end

  def update
    profile_post = ProfilePost.find_by(author_token: params[:author_token])
    return render_not_found if profile_post.nil?

    profile_post.update()
  end

  private def profile_params
    params.require(:profile).permit([:username, :photos, :social_links])
  end

  private def profile_post_params
    params.require(:profile_post).permit([:author_name, :author_photo, :body])
  end


end