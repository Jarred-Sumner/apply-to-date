class AddPhotosToExternalAuthentications < ActiveRecord::Migration[5.1]
  def change
    add_column :external_authentications, :photos, :string, array: true, default: []
  end
end
