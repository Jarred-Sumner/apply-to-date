class BackfillPhotos < ActiveRecord::Migration[5.1]
  def change
    Profile
      .where("array_length(profiles.photos, 1) IS null")
      .includes(:external_authentications)
      .where(external_authentications: { provider: ["facebook", "twitter"] })
      .find_each do |profile|
        if profile.build_default_photo_url.present?
          begin
            upload = Upload.upload_from_url(profile.build_default_photo_url)
            profile.photos.push(Upload.get_public_url(upload.public_url))

            if !profile.visible?
              profile.visible = true
            end

            profile.save!(touch: false)
            puts "Uploading photo for #{profile.id} from #{profile.build_default_photo_url}"
            Rails.logger.info "[BACKFILL] #{profile.id} - #{profile.build_default_photo_url}"
          rescue => e
            Rails.logger.info "[BACKFILL][FAILURE] #{profile.id}: #{profile.build_default_photo_url} - #{e.inspect}"
            puts "[BACKFILL][FAILURE] #{profile.id}: #{profile.build_default_photo_url} - #{e.inspect}"
          end

        end
      end
  end
end
