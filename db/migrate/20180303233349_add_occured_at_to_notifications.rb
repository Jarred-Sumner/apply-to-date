class AddOccuredAtToNotifications < ActiveRecord::Migration[5.1]
  def change
    add_column :notifications, :occurred_at, :datetime
  end
end
