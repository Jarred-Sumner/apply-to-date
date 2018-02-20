class Api::V1::ImagesController < Api::V1::ApplicationController

  def sign
    if params[:objectName].blank?
      return render_error(message: "objectName is required")
    end

    key = "#{SecureRandom.urlsafe_base64}-#{params[:objectName]}".gsub(/[^\w\d_\-\.]/, '')

    presigner = Aws::S3::Presigner.new
    url = presigner.presigned_url(:put_object, bucket: Rails.application.secrets[:bucket_name], key: key, acl: 'public-read')

    public_uri = Addressable::URI.parse(url.to_s.split('?').first)
    public_uri.host = Rails.application.secrets[:asset_host]

    render json: {
      signedUrl: url.to_s,
      filename: key,
      originalFilename: params[:objectName],
      publicUrl: public_uri.to_s
    }
  end

end