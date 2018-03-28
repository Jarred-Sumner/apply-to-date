class PushNotification < Struct.new(:device)
  include ApplicationHelper

  def send_notification!(contents: {}, headings: {}, params: {})
    OneSignal::Notification.create(params: params.merge(
      include_player_ids: [device.onesignal_uid],
      app_id: Rails.application.secrets[:onesignal_app_id],
      contents: contents,
      headings: headings,
    ))
  end
end