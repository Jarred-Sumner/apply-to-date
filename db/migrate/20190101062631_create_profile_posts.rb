class CreateProfilePosts < ActiveRecord::Migration[5.1]
  def change
    create_table :profile_posts do |t|
      t.text :body, null: false
      t.string :author_token, null: false
      t.string :author_name, null: false
      t.string :author_email
      t.string :author_photo, null: false
      t.references :author, foreign_key: { to_table: :users }, type: :uuid, index: true
      t.references :profile, foreign_key: {to_table: :profiles}, type: :citext, index: true
      t.boolean :visible, default: true, null: false

      t.timestamps
    end
    add_index :profile_posts, :author_token, unique: true
  end
end
