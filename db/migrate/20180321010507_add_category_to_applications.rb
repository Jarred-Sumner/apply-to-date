class AddCategoryToApplications < ActiveRecord::Migration[5.1]
  def change
    add_column :applications, :category, :integer
  end
end
