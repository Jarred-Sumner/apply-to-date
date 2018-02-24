class AddApplicationsCountToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :applications_count, :integer, default: 0, null: false

    Profile.reset_column_information
    Profile.find_each do |p|
      Profile.reset_counters p.id, :applications
    end
  end
end
