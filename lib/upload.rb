module Upload

  def self.generate_key(filename)
    "#{SecureRandom.urlsafe_base64}-#{filename}".gsub(/[^\w\d_\-\.]/, '')
  end

  def self.presign_url(key)
    presigner = Aws::S3::Presigner.new
    presigner.presigned_url(:put_object, bucket: Rails.application.secrets[:bucket_name], key: key, acl: 'public-read')
  end

  def self.upload_from_url(url)
    s3 = Aws::S3::Resource.new

    key = generate_key(File.basename(URI.parse(url).path))
    io = open(url)

    object = s3.bucket(Rails.application.secrets[:bucket_name]).object(key)

    object.upload_file(io, {acl: 'public-read'})

    object
  end

  def self.get_public_url(url)
    public_uri = Addressable::URI.parse(url.to_s.split('?').first)

    if Rails.application.secrets[:upload_host] == 'digitalocean'
      public_uri.host = Rails.application.secrets[:asset_host]
    else
      public_uri.host = Rails.application.secrets[:s3_asset_host]
    end

    public_uri.to_s
  end

end