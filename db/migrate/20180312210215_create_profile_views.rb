class CreateProfileViews < ActiveRecord::Migration[5.1]
  def change
    create_table :profile_views do |t|
      t.references :profile, foreign_key: {to_table: :profiles}, index: true, type: :citext
      t.references :user, foreign_key: {to_table: :users}, index: true, type: :uuid
      t.datetime :last_viewed_at, null: false
      t.integer :view_count, null: false, default: 0
      t.references :viewed_by_profile, foreign_key: {to_table: :profiles}, index: true, type: :citext
      t.references :viewed_by_user, foreign_key: {to_table: :users}, index: true, type: :uuid

      t.timestamps
    end

    add_index :profile_views, :last_viewed_at
  end
end
