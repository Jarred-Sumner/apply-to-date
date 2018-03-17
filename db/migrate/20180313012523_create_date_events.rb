class CreateDateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :date_events do |t|
      t.references :profile, foreign_key: true, type: :citext, index: true
      t.references :user, foreign_key: true, type: :uuid, index: true
      t.integer :status, null: false, default: 0
      t.string :summary
      t.date :occurs_on_day
      t.string :occurs_on_day_timezone
      t.time :starts_at
      t.string :starts_at_timezone
      t.time :ends_at
      t.string :ends_at_timezone
      t.string :location
      t.decimal :latitude
      t.decimal :longitude
      t.integer :region, null: false, default: 0
      t.integer :category, null: false, default: 0
      t.string :title
      t.jsonb :sections, default: {}, null: false

      t.timestamps
    end
  end
end
