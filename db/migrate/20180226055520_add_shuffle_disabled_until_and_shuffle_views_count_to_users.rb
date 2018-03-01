class AddShuffleDisabledUntilAndShuffleViewsCountToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :shuffle_disabled_until, :datetime
    add_column :users, :last_shuffled_at, :datetime
    add_column :users, :shuffled_session_count, :integer, default: 0, null: false
    add_column :users, :shuffle_status, :integer, default: 0, null: false
  end
end
