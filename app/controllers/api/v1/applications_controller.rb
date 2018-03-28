class Api::V1::ApplicationsController < Api::V1::ApplicationController
  attr_reader :applying_to_profile, :application
  before_action :require_login, only: :index

  def index
    if params[:count_only].blank?
      applications = current_user.sent_applications.approved.order("created_at DESC").includes(:profile).limit(100)
      render json: ApplicantApplicationSerializer.new(applications, {
        include: [:profile]
      }).serializable_hash
    else
      count = current_user.received_applications.submitted.count
      render json: ApplicantApplicationSerializer.new([], {
        meta: {
          count: count
        }
      }).serializable_hash
    end
  end

  def for_profile
    if logged_in?
      application = Application.where(profile_id: params[:profile_id]).where("email = ? or applicant_id = ?", current_user.email, current_user.id).first
      render json: ApplicantApplicationSerializer.new(application).serializable_hash
    else
      render json: ApplicantApplicationSerializer.new([]).serializable_hash
    end
  end

  def create
    @applying_to_profile = Profile.find(params[:profile_id])

    if current_user.present?
      profile = current_user.profile
      existing_application = Application.where(profile_id: params[:profile_id]).where("applicant_id = ? OR email = ?", current_user.id, current_user.email).first
      if existing_application
        @application = existing_application
        @should_send_email = false
        @application.update(applicant_id: current_user.id) if @application.applicant_id.blank?
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

    if !applying_to_profile.could_be_interested_in?(@application) || applying_to_profile.user.blocked?(@application.applicant_id)
      application.update(status: Application.statuses[:filtered])
    elsif @should_send_email
      ApplicationsMailer.confirmed(@application.id).deliver_later

      notification = Notification.where(
        kind: :new_application,
        notifiable: application,
        occurred_at: @application.created_at,
        user_id: @applying_to_profile.user_id
      ).first_or_create!
      notification.enqueue!
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

      photos = [@application.photos, current_user.try(:profile).try(:photos)].find(&:present?) || []

      if photos.blank? && external_authentications.facebook.exists?
        begin
          facebook = external_authentications.facebook.first
          facebook.get_facebook_photos.each do |photo_url|
            upload = Upload.upload_from_url(photo_url)
            photos.push(Upload.get_public_url(upload.public_url))
          end
        rescue => e
          Raven.capture_exception(e)
          Rails.logger.info e
          Rails.logger.info "AUTO UPLOADING FROM FACEBOOK FAILED #{e.inspect} for application #{@application.inspect}"
        end
      end

      if photos.blank? && external_authentications.with_photos.exists?
        begin
          upload = Upload.upload_from_url(ExternalAuthentication.build_default_photo_url(external_authentications))
          photos.push(Upload.get_public_url(upload.public_url))
        rescue => e
          Raven.capture_exception(e)
          Rails.logger.info e
          Rails.logger.info "UPLOADING DEFAULT PHOTO FAILED #{e.inspect} for application #{@application.inspect}"
        end
      end

      sections = (params[:application][:sections] || {}).permit(Application::DEFAULT_SECTIONS)

      @application.update!(create_params.merge(
        email: email,
        status: Application.submission_statuses[create_params[:status]],
        sections: sections.present? ? sections : Application.build_default_sections,
        photos: photos,
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