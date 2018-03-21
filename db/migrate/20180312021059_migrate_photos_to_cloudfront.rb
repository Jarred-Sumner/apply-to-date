class MigratePhotosToCloudfront < ActiveRecord::Migration[5.1]
  def change
    Profile.where("array_length(photos, 1) > 0").find_each do |profile|
      migrated_photos = profile
        .photos
        .map { |photo| Addressable::URI.parse(photo.to_s.split('?').first) }
        .map do |uri|
          if uri.host == "assets-s3.applytodate.com"
            uri.host = Rails.application.secrets[:s3_asset_host]
          end

          uri.to_s
        end
      Rails.logger.info "[#{profile.id}]: Before - #{profile.photos.join(",")}"
      Rails.logger.info "[#{profile.id}]: After  - #{migrated_photos.join(",")}"
      profile.update(
        photos: migrated_photos
      )
    end
  end
end
