class AddFeaturedToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :featured, :boolean, default: false, null: false
    add_index :profiles, :featured
  end
end
