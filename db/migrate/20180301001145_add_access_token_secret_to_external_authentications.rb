class AddAccessTokenSecretToExternalAuthentications < ActiveRecord::Migration[5.1]
  def change
    add_column :external_authentications, :access_token_secret, :string
  end
end
