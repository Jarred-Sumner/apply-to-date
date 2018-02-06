class CreateProfiles < ActiveRecord::Migration[5.1]
  def change
    create_table :profiles, id: :string do |t|
      t.references :user, type: :uuid, foreign_key: true
      t.jsonb :sections, null: false
      t.boolean :visible, default: true, null: false
      t.jsonb :social_links

      t.timestamps
    end
  end
end
