class AddMetaToNotifications < ActiveRecord::Migration[5.1]
  def change
    add_column :notifications, :meta, :jsonb
  end
end
