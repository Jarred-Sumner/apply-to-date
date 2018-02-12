class Api::V1::ApplicationsController < Api::V1::ApplicationController

  def create
    social_links = params[:application][:social_links].try(:to_unsafe_h) || {}
    external_authentications = params[:application][:external_authentications]

    if create_params[:status] == 'submitted'
      if params[:application][:social_links].blank?
        raise ArgumentError.new("Please include at least one social profile")
      end

      if params[:application][:external_authentications].blank? && params[:application]
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