class Api::V1::ImagesController < Api::V1::ApplicationController

  def sign
    if params[:objectName].blank?
      return render_error(message: "objectName is required")
    end

    key = Upload.generate_key(params[:objectName])
    url = Upload.presign_url(key)

    render json: {
      signedUrl: url.to_s,
      filename: key,
      originalFilename: params[:objectName],
      publicUrl: Upload.get_public_url(url)
    }
  end

end