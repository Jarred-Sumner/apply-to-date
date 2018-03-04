class Api::V1::ApplicationsController < Api::V1::ApplicationController
  attr_reader :applying_to_profile, :application

  def create
    @applying_to_profile = Profile.find(params[:profile_id])

    if current_user.present? && current_user.can_auto_apply?
      profile = current_user.profile
      existing_application = Application.where(profile_id: params[:profile_id]).where("applicant_id = ? OR email = ?", current_user.id, current_user.email).first
      if existing_application
        @application = existing_application
        @should_send_email = false
      else
        @application = Application.create!(
          name: profile.name,
          photos: profile.photos,
          email: current_user.email,
          sections: profile.sections,
          social_links: profile.all_social_networks,
          sex: current_user.sex,
          phone: profile.phone,
          applicant_id: current_user.id,
          profile_id: params[:profile_id],
          status: Application.submission_statuses[:submitted]
        )
        @should_send_email = true
      end
    else
      create_application_from_guest
    end

    if !applying_to_profile.could_be_interested_in?(@application)
      application.update(status: Application.statuses[:filtered])
    elsif @should_send_email
      ApplicationsMailer.confirmed(@application.id).deliver_later
      ApplicationsMailer.pending_app(@application.id).deliver_later
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

        @application.update!(email: String(update_params[:email]))
      end

    end

    render json: ApplicantApplicationSerializer.new(@application, {
      include: [:external_authentications, :profile]
    }).serializable_hash
  end

  private def create_application_from_guest
    social_links = params[:application][:social_links].try(:to_unsafe_h) || {}
    external_authentications = ExternalAuthentication.where(id: Array(params[:application][:external_authentications]))
    email = String(create_params[:email])

    if create_params[:email].blank?
      raise ArgumentError.new("Please include your email")
    end

    ActiveRecord::Base.transaction do
      @application = Application.where(profile_id: params[:profile_id], email: email).first_or_initialize
      @should_send_email = !@application.persisted?

      @application.social_links = ExternalAuthentication.update_social_links(
        (current_user.try(:profile).try(:social_links) || {}).merge(
          social_links
        )
      )

      external_authentications.each do |auth|
        @application.social_links = @application.social_links.merge(auth.build_social_link_entry)
      end

      sections = (params[:application][:sections] || {}).permit(Application::DEFAULT_SECTIONS)

      @application.update!(create_params.merge(
        email: email,
        status: Application.submission_statuses[create_params[:status]],
        sections: sections.present? ? sections : Application.build_default_sections,
        photos: current_user.try(:profile).try(:photos) || [],
        applicant_id: current_user.try(:id)
      ))

      @application.verified_networks.destroy_all
      external_authentications.each do |auth|
        VerifiedNetwork.create!(application_id: @application.id, external_authentication_id: auth.id)
      end
    end
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