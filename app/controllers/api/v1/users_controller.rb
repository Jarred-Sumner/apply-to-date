class Api::V1::UsersController < Api::V1::ApplicationController

  def create
    ActiveRecord::Base.transaction do
      if create_params[:sex].blank?
        return render_error(message: "Please choose your gender")
      end

      if create_params[:interested_in_men].blank? && create_params[:interested_in_women].blank? && create_params[:interested_in_other].blank?
        return render_error(message: "Please fill out the interested in section")
      end

      username = String(create_params[:username]).downcase

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

      @user = User.create!(create_params.merge(password_confirmation: create_params[:password], username: username))

      @profile = Profile.create!(
        create_profile_params.merge(
          user: @user,
          id: username,
          visible: false,
        )
      )

      if params[:external_authentication_id].present?
        @external_authentication = ExternalAuthentication.find(params[:external_authentication_id])
        @external_authentication.user = @user
        @external_authentication.save!

        VerifiedNetwork.create!(profile_id: @profile.id, external_authentication_id: @external_authentication.id)
        @profile.update(recommended_contact_method: @external_authentication.provider)
      end      

      auto_login(@user, true)
    end

    UsersMailer.welcome(@user.id).deliver_later
    render json: UserSerializer.new(@user, {include: [:profile]}).serializable_hash
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
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
      :location, :latitude, :longitude, :name
    ])
  end

end