class PushNotificationWorker
  include Sidekiq::Worker

  def perform(notification_id)
    @notification = Notification.find(notification_id)
    return if !@notification.should_send_push?

    @notification.devices.each do |device|
      begin
        @notification.deliver_push!(device)
      rescue => e
        Rails.logger.debug "PushNotificationWorker[#{notification_id}]: #{e.inspect}"
        Raven.capture_exception(e)
      end
    end


    @notification.touch(:push_sent_at)
  end
end