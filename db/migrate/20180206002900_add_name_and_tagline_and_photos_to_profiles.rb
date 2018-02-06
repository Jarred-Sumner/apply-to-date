class AddNameAndTaglineAndPhotosToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :name, :string
    add_column :profiles, :tagline, :text
    add_column :profiles, :photos, :string, array: true
  end
end
