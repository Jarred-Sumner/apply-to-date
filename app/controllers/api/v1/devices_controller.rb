class Api::V1::DevicesController < Api::V1::ApplicationController


  def update
    @current_device = Device.update_from_headers(request.headers, current_user)

    current_device.update(update_params.merge(
      push_enabled: params[:push_enabled].present? ? params[:push_enabled] === 'true' : current_device.push_enabled?
    ))
  end

  private def update_params
    params.permit(:onesignal_uid, :push_token)
  end

end