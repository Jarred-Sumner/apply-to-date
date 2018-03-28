class AddPushSentAtToDevices < ActiveRecord::Migration[5.1]
  def change
    add_column :devices, :push_sent_at, :datetime
  end
end
