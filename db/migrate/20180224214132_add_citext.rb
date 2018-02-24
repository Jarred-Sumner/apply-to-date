class AddCitext < ActiveRecord::Migration[5.1]
  def up
    enable_extension 'citext'

    remove_foreign_key "applications", "profiles"
    remove_foreign_key "matchmakes", column: "left_profile_id"
    remove_foreign_key "matchmakes", column: "right_profile_id"
    remove_foreign_key "profiles", "users"
    remove_foreign_key "verified_networks", "profiles"

    execute "ALTER TABLE profiles ALTER COLUMN id SET DATA TYPE citext"
    change_column :applications, :profile_id, :citext
    change_column :matchmakes, :left_profile_id, :citext
    change_column :matchmakes, :right_profile_id, :citext
    change_column :verified_networks, :profile_id, :citext

    change_column :applications, :email, :citext
    change_column :users, :email, :citext
    change_column :users, :username, :citext

    add_foreign_key "applications", "profiles"
    add_foreign_key "matchmakes", "profiles", column: "left_profile_id"
    add_foreign_key "matchmakes", "profiles", column: "right_profile_id"
    add_foreign_key "profiles", "users"
    add_foreign_key "verified_networks", "profiles"

    Application.reset_column_information
    Profile.reset_column_information
    VerifiedNetwork.reset_column_information
    User.reset_column_information
    Matchmake.reset_column_information
  end
end
