class Api::V1::SessionsController < Api::V1::ApplicationController
  def create
    if login(create_params[:username], create_params[:password], true)
      render json: UserSerializer.new(current_user, {include: [:profile]}).serializable_hash
    else
      render_error(message: 'Please re-enter your username/password and try again')
    end
  end

  def destroy
    logout
    render json: {success: true}
  end

  private def create_params
    params.require(:session).permit([:username, :password])
  end
end