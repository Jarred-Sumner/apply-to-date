class NewApplicationNotification < PushNotification
  include DateEventApplicationHelper

  def perform(notification)
    application = notification.notifiable

    send_notification!({
      contents: {
        en: "#{short_profile_name(application)} wants to go on a date with you"
      },
      headings: {
        en: "#{short_profile_name(application)} asked you out!"
      }
    })
  end
end