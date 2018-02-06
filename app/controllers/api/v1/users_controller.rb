class Api::V1::UsersController < Api::V1::ApplicationController

  def create
    @user = User.create!(create_params.merge(password_confirmation: create_params[:password]))
    @profile = Profile.create!(
      user: @user,
      id: @user.username
    )
    auto_login(@user, true)
    render json: UserSerializer.new(@user, {include: [:profile]}).serializable_hash
  rescue ActiveRecord::RecordInvalid => e
    render_error(message: e.record.errors.full_messages.join(' and '))
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