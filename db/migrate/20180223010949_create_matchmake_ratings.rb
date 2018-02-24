class CreateMatchmakeRatings < ActiveRecord::Migration[5.1]
  def change
    create_table :matchmake_ratings do |t|
      t.references :user, foreign_key: true, type: :uuid
      t.references :matchmake, foreign_key: true
      t.integer :score, null: false

      t.timestamps
    end
  end
end
