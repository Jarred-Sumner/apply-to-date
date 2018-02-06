class CreateExternalAuthentications < ActiveRecord::Migration[5.1]
  def change
    create_table :external_authentications, :id => :uuid do |t|
      t.string :uid
      t.string :provider, null: false
      t.references :user, type: :uuid, foreign_key: true

      t.timestamps
    end

    add_index :external_authentications, :provider
    add_index :external_authentications, :uid
  end
end
