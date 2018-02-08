class AddApplicationToExternalAuthentication < ActiveRecord::Migration[5.1]
  def change
    add_reference :external_authentications, :application, foreign_key: true, type: :uuid
  end
end
