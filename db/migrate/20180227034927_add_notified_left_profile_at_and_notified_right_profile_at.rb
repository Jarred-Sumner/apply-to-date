class AddNotifiedLeftProfileAtAndNotifiedRightProfileAt < ActiveRecord::Migration[5.1]
  def change
    add_column :matchmakes, :notified_left_profile_at, :datetime
    add_column :matchmakes, :notified_right_profile_at, :datetime
  end
end
