class AddClaimedToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :claimed, :boolean, default: true, null: false
    add_reference :profiles, :posted_by, foreign_key: {to_table: :profile_posts}, index: true
  end
end
