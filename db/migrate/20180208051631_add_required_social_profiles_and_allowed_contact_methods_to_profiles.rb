class AddRequiredSocialProfilesAndAllowedContactMethodsToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :recommended_contact_methods, :string, array: true, default: [], null: false

    add_column :profiles, :location, :string
    add_column :profiles, :latitude, :decimal
    add_column :profiles, :longitude, :decimal
  end
end
