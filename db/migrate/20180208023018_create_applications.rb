class CreateApplications < ActiveRecord::Migration[5.1]
  def change
    create_table :applications, :id => :uuid do |t|
      t.references :applicant, foreign_key: { to_table: :users }, type: :uuid
      t.references :profile, foreign_key: true, null: false, type: :string
      t.references :user, foreign_key: true, null: false, type: :uuid
      t.integer :status, default: 0, null: false
      t.jsonb :social_links, default: {}, null: false
      t.jsonb :sections, null: false
      t.string :name, default: '', null: false
      t.string :email, null: false
      t.string :photos, default: [], null: false, array: true
      t.string :location
      t.decimal :latitude
      t.decimal :longitude

      t.timestamps
    end

    add_index :applications, :email
    add_index :applications, :status
  end
end
