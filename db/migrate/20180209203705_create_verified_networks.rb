class CreateVerifiedNetworks < ActiveRecord::Migration[5.1]
  def change
    create_table :verified_networks do |t|
      t.references :external_authentication, foreign_key: true, type: :uuid
      t.references :profile, foreign_key: true, type: :string
      t.references :application, foreign_key: true, type: :uuid
      t.string :email

      t.timestamps
    end
  end
end
