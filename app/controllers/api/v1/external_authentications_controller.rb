class Api::V1::ExternalAuthenticationsController < Api::V1::ApplicationController
  def show
    auth = ExternalAuthentication.find_by!(user: nil, id: params[:id])
    render json: ExternalAuthenticationSerializer.new(auth).serializable_hash
  end

  def create
    
  end
end