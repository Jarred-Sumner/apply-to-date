class Api::V1::DateEventApplicationsController < Api::V1::ApplicationController
  before_action :require_login, only: :index
  attr_reader :date_event

  def create
    @date_event = DateEvent.appliable.find(params[:date_event_id])

    sections = params[:sections].try(:permit, DateEventApplication::DEFAULT_SECTIONS) || {}

    if logged_in?
      if current_user.id == date_event.user_id
        render_error(message: "Can't ask yourself out to a date :)")
        return
      end

      ActiveRecord::Base.transaction do
        @date_event_application = date_event.date_event_applications.where(
          "profile_id = ? OR email = ?", current_profile.id, current_user.email
        ).first_or_initialize

        @date_event_application.profile_id = current_profile.id
        @date_event_application.email = current_user.email
        @date_event_application.photos = current_profile.photos
        @date_event_application.sex = current_profile.sex
        @date_event_application.recommended_contact_method = current_profile.recommended_contact_method
        @date_event_application.name = current_profile.name
        @date_event_application.social_links = current_profile.social_links
        @date_event_application.sections = current_profile.sections

        @date_event_application.save!

        @date_event_application.verified_networks.destroy_all
        current_profile.external_authentications.each do |auth|
          VerifiedNetwork.create!(date_event_application_id: @date_event_application.id, external_authentication_id: auth.id)
        end

        @notification = Notification.where(
          user: date_event.user,
          notifiable: @date_event_application,
          kind: Notification.kinds[
            :new_date_event_application
          ]
        ).first_or_create!
      end
    else
      create_application_from_guest
    end

    @notification.enqueue!

    if !performed?
      render json: DateEventApplicationSerializer.new(@date_event_application).serializable_hash
    end
  rescue ArgumentError => e
    Rails.logger.error(e)
    render_error(message: e.message)
  end

  def index_event
    applications = DateEventApplication.where(date_event: current_user.date_events.find(params[:date_event_id]))
    render json: DateEventApplicationSerializer.new(applications.limit(100), {
      }).serializable_hash
  end

  def index
    if params[:date_event_ids].present?
      @date_event_applications = current_user.date_event_applications.where(date_event_id: Array(params[:date_event_ids]))
    elsif params[:approval_status] == 'approved'
      @date_event_applications = current_user.date_event_applications.approved.order("created_at DESC").limit(100)
    else
      @date_event_applications = DateEventApplication.joins(:date_event).where(
        "(date_event_applications.profile_id = ?) OR date_events.profile_id = ?", current_profile.id, current_profile.id
      ).order("date_event_applications.created_at DESC").limit(100)
    end

    render json: DateEventApplicationSerializer.new(@date_event_applications || [], {
      }).serializable_hash
  end

  def show
    render json: DateEventApplicationSerializer.new(date_event_application, { include: [:external_authentications]
    }).serializable_hash
  end

  def update
    ActiveRecord::Base.transaction do
      if !params[:sections].nil?
        sections = params[:sections].permit(DateEventApplication::DEFAULT_SECTIONS)
        date_event_application.update!(sections: sections)
      end

      if !params[:photos].nil?
        photos = Array(params[:photos])
        # Ensure Photo URLs are valid
        begin
          photos.each do |photo|
            URI.parse(URI.encode(photo))
          end
        rescue URI::InvalidURIError
          raise ArgumentError.new("Please re-upload your photos and try again")
        end

        date_event_application.update!(photos: Array(params[:photos]))
      end

      if !params[:social_links].nil?
        social_links = ExternalAuthentication.update_social_links(
          params[:social_links]
        )
        date_event_application.update!(social_links: social_links)
      end

      if params[:confirmation_status] == 'confirmed' && date_event_application.approved?
        date_event_application.confirmed!
        date_event_application.date_event.chose_applicant!
      elsif params[:confirmation_status] == 'declined' && date_event_application.approved?
        date_event_application.declined!
        if date_event_application.date_event.can_still_choose_someone?
          date_event_application.date_event.scheduled!
        end
      end
    end

    render json: DateEventApplicationSerializer.new(date_event_application, {
      }).serializable_hash
  end

  private def date_event_application
    return @date_event_application if @date_event_application

    if current_user.present?
      @date_event_application = DateEventApplication
        .joins(:date_event)
        .where(
          "date_event_applications.id = ? AND (date_event_applications.profile_id = ? OR date_events.profile_id = ?)",
          params[:id],
          current_profile.id,
          current_profile.id
        ).first!
    else
      @date_event_application = DateEventApplication.where(profile_id: nil).find(params[:id])
    end
  end

  private def create_application_from_guest
    social_links = params[:social_links].try(:to_unsafe_h) || {}
    external_authentications = ExternalAuthentication.where(id: Array(params[:external_authentications]))
    email = String(create_params[:email])

    if create_params[:email].blank?
      raise ArgumentError.new("Please include your email")
    end

    ActiveRecord::Base.transaction do
      @date_event_application = date_event.date_event_applications.where(email: email).first_or_initialize
      @should_send_email = !@date_event_application.persisted?

      @date_event_application.social_links = ExternalAuthentication.update_social_links(
        (current_user.try(:profile).try(:social_links) || {}).merge(
          social_links
        )
      )

      photos = [@date_event_application.photos, current_user.try(:profile).try(:photos)].find(&:present?) || []

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

      sections = (params[:sections] || {}).permit(DateEventApplication::DEFAULT_SECTIONS)

      @date_event_application.update!(create_params.merge(
        email: email,
        approval_status: DateEventApplication.submission_statuses[params[:status]],
        sections: sections.present? ? sections : DateEventApplication.build_default_sections,
        photos: photos,
        profile_id: current_profile.try(:id),
        date_event_id: date_event.id,
      ))

      @date_event_application.verified_networks.destroy_all
      external_authentications.each do |auth|
        VerifiedNetwork.create!(date_event_application_id: @date_event_application.id, external_authentication_id: auth.id)
      end

      external_authentications.each do |auth|
        @date_event_application.social_links = @date_event_application.social_links.merge(auth.build_social_link_entry)
      end

      @date_event_application.save!
      @notification = Notification.where(
        user: date_event.user,
        notifiable: @date_event_application,
        kind: Notification.kinds[
          :new_date_event_application
        ]
      ).first_or_create!
    end
  end


  private def create_params
    params
      .permit(:name, :photos, :email, :name, :recommended_contact_method, :sex, :phone)
  end
end