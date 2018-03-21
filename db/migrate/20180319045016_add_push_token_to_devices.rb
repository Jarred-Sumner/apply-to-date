class AddPushTokenToDevices < ActiveRecord::Migration[5.1]
  def change
    add_column :devices, :push_token, :string
  end
end
