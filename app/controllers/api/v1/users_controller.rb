class Api::V1::UsersController < Api::V1::ApplicationController

  def create
    ActiveRecord::Base.transaction do
      if create_params[:sex].blank?
        return render_error(message: "Please choose your gender")
      end

      username = String(create_params[:username])

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

      if create_params[:interested_in_men].blank? && create_params[:interested_in_women].blank? && create_params[:interested_in_other].blank?
        return render_error(message: "Please fill out the interested in section")
      end

      @user = User.create!(create_params.merge(password_confirmation: create_params[:password], username: username))

      @profile = Profile.create!(
        create_profile_params.merge(
          user: @user,
          id: username,
          visible: true,
        )
      )

      if params[:external_authentication_id].present?
        @external_authentication = ExternalAuthentication.find(params[:external_authentication_id])
        @external_authentication.user = @user
        @external_authentication.save!

        VerifiedNetwork.create!(profile_id: @profile.id, external_authentication_id: @external_authentication.id)
      elsif Array(params[:external_authentication_ids]).present?
        auths = ExternalAuthentication.where(user_id: nil, id: Array(params[:external_authentication_ids]))
        if auths.blank?
          raise ArgumentError.new("You already have an account. To continue, please login")
        end

        auths.each do |auth|
          auth.update!(user_id: @user.id)
          VerifiedNetwork.create!(profile_id: @profile.id, external_authentication_id: auth.id)
        end
      end

      if @profile.external_authentications.facebook.exists?
        begin
          facebook = @profile.external_authentications.facebook.first
          facebook.get_facebook_photos.each do |photo_url|
            upload = Upload.upload_from_url(photo_url)
            @profile.photos.push(Upload.get_public_url(upload.public_url))
            @profile.save!
          end
        rescue => e
          Raven.capture_exception(e)
          Rails.logger.info e
          Rails.logger.info "AUTO UPLOADING FROM FACEBOOK FAILED #{e.inspect} for user #{@user.id} - #{@profile.id}"
        end
      end

      if @profile.photos.blank? && @profile.build_default_photo_url.present?
        begin
          upload = Upload.upload_from_url(@profile.build_default_photo_url)
          @profile.photos.push(Upload.get_public_url(upload.public_url))
          @profile.save!
        rescue => e
          Raven.capture_exception(e)
          Rails.logger.info e
          Rails.logger.info "UPLOADING DEFAULT PHOTO FAILED #{e.inspect} for user #{@user.id} - #{@profile.id}"
        end
      end

      @profile.external_authentications.each do |auth|
        @profile.social_links = @profile.social_links.merge(auth.build_social_link_entry)
      end
      @profile.save!

      auto_login(@user, true)
    end

    UsersMailer.welcome(@user.id).deliver_later
    render json: UserSerializer.new(@user, {include: [:profile]}).serializable_hash
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  rescue ArgumentError => e
    render_error(message: e.message)
  end

  def me
    if logged_in?
      render json: UserSerializer.new(current_user, {include: [:profile]}).serializable_hash
    else
      render json: { data: nil }
    end
  end

  private def create_params
    params.require(:user).permit([:email, :username, :password, :interested_in_men, :interested_in_women, :interested_in_other, :sex])
  end

  private def create_profile_params
    params.require(:profile).permit([
      :location, :latitude, :longitude, :name, :phone, :birthday
    ])
  end

end