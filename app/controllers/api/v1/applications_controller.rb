class Api::V1::ApplicationsController < Api::V1::ApplicationController

  def create
    social_links = params[:application][:social_links].to_unsafe_h
    external_authentications = params[:application][:external_authentications]
    sections = params[:application][:sections].to_unsafe_h

    if create_params[:status] == 'submitted'
      if params[:application][:social_links].blank?
        raise ArgumentError.new("Please include at least one social profile")
      end

      if params[:application][:external_authentications].blank?
        raise ArgumentError.new("Please verify your Facebook, SMS, Instagram, or Twitter first.")
      end
    end

    if create_params[:email].blank? 
      raise ArgumentError.new("Please include your email")
    end

    ActiveRecord::Base.transaction do
      @application = Application.where(profile_id: params[:profile_id], email: create_params[:email]).first_or_initialize
      
      if !@application.pending?
        raise ArgumentError.new("You've already submitted your application")
      end

      @application.update(create_params.merge(
        sections: sections,
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
    @application = Application.includes(:external_authentications).find(params[:id])

    render json: ApplicantApplicationSerializer.new(@application, {
      include: [:external_authentications]
    }).serializable_hash
  end

  def update

  end

  private def create_params
    params
      .require(:application)
      .permit(:status, :name, :photos, :email, :name, :status)
  end

end