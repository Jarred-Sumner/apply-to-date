class NewDateEventApplicationNotification < PushNotification
  include DateEventApplicationHelper

  def perform(notification)
    date_event_application = notification.notifiable

    send_notification!({
      contents: {
        en: "#{short_profile_name(date_event_application)} wants be your #{category_label(date_event_application)} date #{format_date_event_time(date_event_application)}"
      },
      headings: {
        en: "#{short_profile_name(date_event_application)} asked you out!"
      }
    })
  end
end