class AddAppearInDiscoverAndAppearInMatchmakeToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :appear_in_discover, :boolean, default: true, null: false
    add_column :profiles, :appear_in_matchmake, :boolean, default: true, null: false
    add_index :profiles, :appear_in_discover
    add_index :profiles, :appear_in_matchmake
  end
end
