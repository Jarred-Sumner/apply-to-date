class CreateDateEventApplications < ActiveRecord::Migration[5.1]
  def change
    create_table :date_event_applications do |t|
      t.references :profile, foreign_key: {to_table: :profiles}, index: true, type: :citext

      t.references :date_event, foreign_key: true, index: true
      t.integer :confirmation_status, default: 0, null: false
      t.integer :approval_status, default: 0, null: false

      t.jsonb :social_links, default: {}, null: false
      t.jsonb :sections, null: false, default: {}
      t.string :name, default: '', null: false
      t.string :email, null: false
      t.string :photos, default: [], null: false, array: true
      t.string :phone

      t.timestamps
    end

    add_index :date_event_applications, :confirmation_status
    add_index :date_event_applications, :approval_status
  end
end
