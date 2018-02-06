class AddAccessTokenAndRefreshTokenAndAccessTokenExpirationToExternalAuthentications < ActiveRecord::Migration[5.1]
  def change
    add_column :external_authentications, :access_token, :string, null: false
    add_column :external_authentications, :refresh_token, :string
    add_column :external_authentications, :access_token_expiration, :datetime
  end
end
