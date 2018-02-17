class Api::V1::ResetPasswordsController < Api::V1::ApplicationController

  def create
    @user = User.load_from_reset_password_token(params[:id])
    if !@user
      raise ArgumentError.new("This link is no longer valid, please go to /forgot-password and get a new link")
    end

    ActiveRecord::Base.transaction do
      @user.password = params[:password]
      @user.password_confirmation = params[:password]
      @user.save!
      @user.generate_reset_password_token!
      auto_login(@user, true)
    end

    render json: UserSerializer.new(@user, {include: [:profile]}).serializable_hash
  rescue ArgumentError => e
    render_error(message: e.message)
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end

end