class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def login_as
    if params[:profile].present?
      @user = Profile.find(params[:profile]).user
    else
      @user = User.find_by!(email: params[:email])
    end

    auto_login(@user)

    redirect_to Api::V1::ApplicationController.build_frontend_uri("/", {}).to_s
  end

  def root
    render json: {
      object: 'homepage',
      message: "Hi."
    }
  end
end
