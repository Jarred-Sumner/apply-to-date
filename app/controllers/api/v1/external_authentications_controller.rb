class Api::V1::ExternalAuthenticationsController < Api::V1::ApplicationController
  def show
    auth = ExternalAuthentication.find_by!(user: nil, id: params[:id])
    render json: ExternalAuthenticationSerializer.new(auth).serializable_hash
  end

  def create
    if auth_hash.present? && auth_hash.uid.present? && auth_hash.provider.present?
      auth = ExternalAuthentication.update_from_omniauth(auth_hash)
      if auth.user.present?
        redirect_to Rails.application.secrets[:frontend_url] + "/"
      else
        redirect_to Rails.application.secrets[:frontend_url] + "/sign-up/#{auth_hash.provider}/#{auth.id}"
      end
    else
      redirect_to Rails.application.secrets[:frontend_url] + "?login-failure=true"
    end
  end

  protected

  def auth_hash
    request.env['omniauth.auth']
  end
end