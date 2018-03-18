class Api::V1::DateEventApplicationsController < Api::V1::ApplicationController
  before_action :require_login, only: :index
  def create
    date_event = DateEvent.scheduled.find(params[:date_event_id])

    sections = params[:sections].try(:permit, Application::DEFAULT_SECTIONS) || {}

    if logged_in?
      if current_user.id == date_event.user_id
        render_error(message: "Can't ask yourself out to a date :)")
        return
      end

      @date_event_application = date_event.date_event_applications.where(
        "profile_id = ? OR email = ?", current_profile.id, current_user.email
      ).first_or_initialize

      @date_event_application.profile_id = current_profile.id
      @date_event_application.email = current_user.email
      @date_event_application.photos = current_profile.photos
      @date_event_application.sex = current_profile.sex
      @date_event_application.recommended_contact_method = current_profile.recommended_contact_method
      @date_event_application.name = current_profile.name
      @date_event_application.sections = current_profile.sections

      @date_event_application.save!
    else

    end

    render json: DateEventApplicationSerializer.new(@date_event_application).serializable_hash
  end

  def index_event
    date_event = DateEvent.includes(:date_event_applications).find(params[:date_event_id])
    render json: DateEventApplicationSerializer.new(date_event.date_event_applications.limit(100), {
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
    render json: DateEventApplicationSerializer.new(date_event_application, {
    }).serializable_hash
  end

  def update
    if !params[:sections].nil?
      sections = params[:sections].permit(DateEventApplication::DEFAULT_SECTIONS)
      date_event_application.update(sections: sections)
    end

    if params[:confirmation_status] == 'confirmed' && date_event_application.approved?
      ActiveRecord::Base.transaction do
        date_event_application.confirmed!
        date_event_application.date_event.chose_applicant!
      end
    elsif params[:confirmation_status] == 'declined' && date_event_application.approved?
      ActiveRecord::Base.transaction do
        date_event_application.declined!
        if date_event_applciation.date_event.can_still_choose_someone?
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

end