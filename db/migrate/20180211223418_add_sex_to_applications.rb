class AddSexToApplications < ActiveRecord::Migration[5.1]
  def change
    add_column :applications, :sex, :string
  end
end
