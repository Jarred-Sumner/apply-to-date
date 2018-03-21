class CreateBlockUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :block_users do |t|
      t.references :blocked_user, foreign_key: {to_table: :users}, index: true, type: :uuid, null: false
      t.references :blocked_by, foreign_key: {to_table: :users}, index: true, type: :uuid, null: false

      t.timestamps
    end
  end
end
