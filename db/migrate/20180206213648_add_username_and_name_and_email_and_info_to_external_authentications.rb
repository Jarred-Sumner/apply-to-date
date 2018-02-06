class AddUsernameAndNameAndEmailAndInfoToExternalAuthentications < ActiveRecord::Migration[5.1]
  def change
    add_column :external_authentications, :username, :string
    add_column :external_authentications, :email, :string
    add_column :external_authentications, :name, :string
    add_column :external_authentications, :info, :jsonb
    add_column :external_authentications, :raw_info, :jsonb
  end
end
