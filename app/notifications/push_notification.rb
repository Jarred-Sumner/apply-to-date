class PushNotification < Struct.new(:device)
  include ApplicationHelper

  def send_notification!(contents: {}, headings: {}, params: {})
    merged_params = params.merge(
      include_player_ids: [device.onesignal_uid],
      app_id: Rails.application.secrets[:onesignal_app_id],
      contents: contents,
      headings: headings,
    )

    if Rails.env.development?
      Rails.logger.info "PUSH: #{merged_params.inspect}"
    else
      OneSignal::Notification.create(params: merged_params)
    end
  end
end