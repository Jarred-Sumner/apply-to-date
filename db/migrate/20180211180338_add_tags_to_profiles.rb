class AddTagsToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :tags, :string, array: true, null: false, default: []
  end
end
