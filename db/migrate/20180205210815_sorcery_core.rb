class SorceryCore < ActiveRecord::Migration[5.1]
  def change
    enable_extension 'uuid-ossp'
    enable_extension 'pgcrypto'

    create_table :users, :id => :uuid do |t|
      t.string :email,            :null => false
      t.string :username,            :null => false
      t.string :crypted_password
      t.string :salt

      t.timestamps                :null => false
    end

    add_index :users, :email, unique: true
    add_index :users, :username, unique: true
  end
end
