class AddLocationToExternalAuthentications < ActiveRecord::Migration[5.1]
  def change
    add_column :external_authentications, :location, :string
  end
end
