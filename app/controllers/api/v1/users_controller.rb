class Api::V1::UsersController < Api::V1::ApplicationController

  def create
    ActiveRecord::Base.transaction do
      @external_authentication = ExternalAuthentication.find(params[:external_authentication_id])

      @user = User.create!(create_params.merge(password_confirmation: create_params[:password]))

      @external_authentication.user = @user
      @external_authentication.save!

      @profile = Profile.create!(
        user: @user,
        id: @user.username,
        name: @external_authentication.name.split(' ').first,
        tagline: @external_authentication.info["description"],
      )

      VerifiedNetwork.create!(profile_id: @profile.id, external_authentication_id: @external_authentication.id)

      auto_login(@user, true)
      render json: UserSerializer.new(@user, {include: [:profile]}).serializable_hash
    end
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end

  def me
    if logged_in?
      render json: UserSerializer.new(current_user, {
        include: [:profile]
      }).serializable_hash
    else
      render json: { data: nil }
    end
  end

  private def create_params
    params.require(:user).permit([:email, :username, :password])
  end

end