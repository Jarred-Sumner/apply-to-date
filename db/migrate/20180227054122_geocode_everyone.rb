class GeocodeEveryone < ActiveRecord::Migration[5.1]
  def change
    Profile.where("latitude = longitude AND location != '' AND location is NOT NULL", "").find_each do |profile|
      profile.update_from_geocode
      puts "Geocoded: #{profile.id} - #{profile.location} (#{profile.latitude}, #{profile.longitude})"
    end
  end
end
