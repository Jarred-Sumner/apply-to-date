class Api::V1::ApplicationsController < Api::V1::ApplicationController

  def create
    social_links = params[:application][:social_links].try(:to_unsafe_h) || {}
    external_authentications = params[:application][:external_authentications]

    if create_params[:status] == 'submitted'
      if params[:application][:social_links].blank?
        raise ArgumentError.new("Please include at least one social profile")
      end

      if params[:application][:external_authentications].blank? && create_params[:phone].present?
        raise ArgumentError.new("Please verify your Facebook, SMS, Instagram, or Twitter first.")
      end
    end

    if create_params[:email].blank? 
      raise ArgumentError.new("Please include your email")
    end

    email = String(create_params[:email]).downcase

    ActiveRecord::Base.transaction do
      @application = Application.where(profile_id: params[:profile_id], email: email).first_or_initialize

      @application.update!(create_params.merge(
        email: email,
        status: Application.submission_statuses[create_params[:status]],
        applicant_id: current_user.try(:id)
      ))

      @application.verified_networks.destroy_all
      external_authentications.each do |id|
        VerifiedNetwork.create!(application_id: @application.id, external_authentication_id: id)
      end

      @application.social_links = ExternalAuthentication.update_social_links(social_links)
    end

    render json: ApplicantApplicationSerializer.new(@application, {
      include: [:external_authentications]
    }).serializable_hash
  rescue ArgumentError => e
    Rails.logger.error(e)
    render_error(message: e.message)
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error(e)
    render_validation_error(e)
  end

  def show_applicant
    @application = Application.includes(:external_authentications, :profile).find(params[:id])

    render json: ApplicantApplicationSerializer.new(@application, {
      include: [:external_authentications, :profile]
    }).serializable_hash
  end

  def update
    @application = Application.find(params[:id])
    if @application.applicant_id.present? && current_user.try(:id) != @application.applicant_id
      return render_forbidden
    end

    ActiveRecord::Base.transaction do
      if !update_params[:social_links].nil?
        social_links = ExternalAuthentication.update_social_links(
          update_params[:social_links]
        )
        @application.update!(social_links: social_links)
      end

      if !params[:application][:photos].nil?
        photos = Array(params[:application][:photos])
        # Ensure Photo URLs are valid
        begin
          photos.each do |photo|
            URI.parse(URI.encode(photo))
          end
        rescue URI::InvalidURIError
          raise ArgumentError.new("Please re-upload your photos and try again")
        end

        @application.update(photos: photos)
      end

      if params[:application][:sections].present?
        sections = params[:application][:sections].permit(Application::DEFAULT_SECTIONS)
        @application.update!(sections: sections)
      end

      if !update_params[:email].nil?
        if Application.fetch(email: update_params[:email], profile_id: @application.profile_id)
          raise ArgumentError.new("Try a different email")
        end

        @application.update!(email: String(update_params[:email]).downcase)
      end

    end

    render json: ApplicantApplicationSerializer.new(@application, {
      include: [:external_authentications, :profile]
    }).serializable_hash
  end

  private def create_params
    params
      .require(:application)
      .permit(:status, :name, :photos, :email, :name, :status, :recommended_contact_method, :sex, :phone)
  end

  private def update_params
    params
      .require(:application)
      .permit(:email, :social_links, :photos, :sections, :email)
  end

end