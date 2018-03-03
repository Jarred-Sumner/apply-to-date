class CreateNotifications < ActiveRecord::Migration[5.1]
  def change
    create_table :notifications do |t|
      t.string :chrome_notification_uid
      t.integer :kind, default: 0, null: false
      t.integer :status, default: 0, null: false
      t.datetime :chrome_notification_sent_at
      t.datetime :email_sent_at
      t.datetime :expires_at
      t.datetime :read_at
      t.references :user, foreign_key: true, index: true, type: :uuid
      t.references :notifiable, index: true, polymorphic: true, foreign_key: false

      t.timestamps
    end

    add_index :notifications, :kind
    add_index :notifications, [:user_id, :status]
  end
end
