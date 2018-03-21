class BackfillApplicationPhotos < ActiveRecord::Migration[5.1]
  def change
    count = 0
    Application
      .includes(:external_authentications)
      .where("array_length(applications.photos, 1) IS NULL")
      .where(external_authentications: {
        provider: ['twitter', 'facebook']
      })
      .find_each do |app|
        begin
          upload = Upload.upload_from_url(
            ExternalAuthentication.build_default_photo_url(app.external_authentications)
          )
          photo_url = Upload.get_public_url(
            upload.public_url
          )

          app.photos = [photo_url]

          app.save!(touch: false)

          puts "Backfilling photo for #{app.id}"
          count = count + 1
        rescue => e
          Rails.logger.info "Exception while backfilling: #{app.id} - #{e.inspect}"
          puts "Exception while backfilling: #{app.id} - #{e.inspect}"
        end
      end
    puts "Backfilled #{count} photos"
  end
end
