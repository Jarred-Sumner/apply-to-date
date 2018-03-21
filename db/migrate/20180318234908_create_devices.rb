class CreateDevices < ActiveRecord::Migration[5.1]
  def change
    create_table :devices do |t|
      t.string :onesignal_uid
      t.string :uid, null: false
      t.boolean :push_enabled, default: false, null: false
      t.string :platform
      t.string :app_version
      t.string :timezone
      t.datetime :last_seen_at, null: false
      t.string :platform_version
      t.references :user, foreign_key: true, index: true, type: :uuid

      t.timestamps
    end

    add_index :devices, :uid, unique: true
    add_index :devices, :onesignal_uid, unique: true
  end
end
