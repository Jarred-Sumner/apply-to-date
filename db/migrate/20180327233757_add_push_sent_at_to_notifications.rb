class AddPushSentAtToNotifications < ActiveRecord::Migration[5.1]
  def change
    add_column :notifications, :push_sent_at, :datetime
  end
end
