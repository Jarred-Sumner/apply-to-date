class AddRegionToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :region, :integer

    DateEvent::REGION_CENTERS.keys.each do |region_center|
      Profile.within(
        100,
        origin: DateEvent::REGION_CENTERS[region_center]
      ).update_all(region: Profile.regions[region_center])
    end
  end
end
