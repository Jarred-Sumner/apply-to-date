class CreateMatchmakes < ActiveRecord::Migration[5.1]
  def change
    create_table :matchmakes do |t|
      t.references :left_profile, foreign_key: {to_table: :profiles}, type: :string
      t.references :right_profile, foreign_key: {to_table: :profiles}, type: :string
      t.integer :matchmake_users_count, default: 0, null: false
      t.decimal :rating, default: 0, null: false
      t.integer :status, default: 0, null: false

      t.timestamps
    end

    add_index :matchmakes, :status
  end
end
