class AddSlugToDateEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :date_events, :slug, :citext
    add_index :date_events, :slug
  end
end
