class BackfillNotifications < ActiveRecord::Migration[5.1]
  def change
    Application
      .approved
      .where("applicant_id IS NOT NULL")
      .find_each do |application|
        Notification.create!(
          user_id: application.applicant_id,
          notifiable: application.profile,
          occurred_at: application.updated_at,
          kind: Notification.kinds[:approved_application],
          status: Notification.statuses[:unread]
        )
      end

    Application
      .submitted
      .find_each do |application|
        Notification.create!(
          user_id: application.user_id,
          notifiable: application,
          occurred_at: application.created_at,
          kind: Notification.kinds[:new_application],
          status: Notification.statuses[:unread]
        )
      end
  end
end
