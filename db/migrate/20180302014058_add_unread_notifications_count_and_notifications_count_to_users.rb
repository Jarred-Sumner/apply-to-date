class AddUnreadNotificationsCountAndNotificationsCountToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :unread_notifications_count, :integer, default: 0, null: false
    add_column :users, :notifications_count, :integer, default: 0, null: false
  end
end
