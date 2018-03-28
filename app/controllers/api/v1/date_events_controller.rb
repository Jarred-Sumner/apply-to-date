class Api::V1::DateEventsController < Api::V1::ApplicationController
  before_action :require_login, except: [:show, :show_slug]

  def index
    if params[:profile_id] == 'me'
      date_events = current_user
        .date_events
        .upcoming
        .order("occurs_on_day ASC, starts_at ASC")
        .limit(100)

      render json: DateEventSerializer.new(date_events).serializable_hash
    elsif params[:region].present?
      region = String(params[:region])
      time_zone = DateEvent.time_zone(region)

      date_events = DateEvent
        .where(region: DateEvent.regions[region])
        .appliable
        .visible_to(current_user)
        .includes(:profile)
        .where(Profile.build_interested_in_columns(current_user.profile.sex))
        .where(profiles: { sex: current_user.profile.interested_in_sexes })
        .order("occurs_on_day ASC, starts_at ASC")
        .limit(100)

      render json: DateEventSerializer.new(date_events, {
        include: [:profile]
      }).serializable_hash
    elsif params[:id].present?
      date_events = DateEvent.includes(:profile).where(id: Array(params[:id]))

      render json: DateEventSerializer.new(date_events, {
        include: [:profile]
      }).serializable_hash
    else
      render json: DateEventSerializer.new([], {
        include: [:profile]
      }).serializable_hash
    end
  end

  def create
    if !DateEvent.regions.include?(String(create_params[:region]))
      render_error(message: "Please choose a valid region")
      return
    end

    time_zone = DateEvent.time_zone(create_params[:region])
    occurs_on_day = time_zone.parse(create_params[:occurs_on_day])

    date_event = DateEvent.create!(
      create_params.merge(
        user_id: current_user.id,
        profile_id: current_profile.id,
        status: DateEvent.statuses[:scheduled],
        region: DateEvent.regions[create_params[:region]],
        occurs_on_day: occurs_on_day.to_date,
      )
    )

    render json: DateEventSerializer.new(date_event, {
      include: [:profile]
    }).serializable_hash
  end

  def rate
    date_event = current_user
    .date_events
    .find(params[:date_event_id])
    de_application = date_event
        .date_event_applications
        .find(params[:date_event_application_id])

    if date_event.can_still_choose_someone? && DateEventApplication.approval_statuses[params[:approval_status]].present?
      if params[:approval_status] == 'approved'
        de_application.approved!
      elsif params[:approval_status] == 'rejected'
        de_application.rejected!
      elsif params[:approval_status] == 'swap_date'
        de_application.swap_date!(params[:category])
      end

      render json: DateEventApplicationSerializer.new(date_event.date_event_applications).serializable_hash
    else
      return render_error(message: "This date is no longer available")
    end
  end

  def update
    date_event = current_user.date_events.find(params[:id])
    time_zone = date_event.time_zone

    if params[:status].present?
      date_event.status = DateEvent.statuses[params[:status]]
    end

    if params[:occurs_on_day].present?
      date_event.occurs_on_day = time_zone.parse(create_params[:occurs_on_day]).to_date
    end

    if params[:location].present?
      date_event.location = params[:location]
    end

    if params[:category].present? && DateEvent.categories.keys.map(&:to_s).include?(params[:category])
      date_event.category = params[:category]
    end

    if !params[:summary].nil?
      date_event.summary = params[:summary]
    end

    date_event.save!

    render json: DateEventSerializer.new(date_event, {
      include: [:profile]
    }).serializable_hash
  end

  def show
    if params[:profile_id] == 'me'
      date_event = current_user
        .date_events
        .find(params[:id])

      render json: DateEventSerializer.new(date_event).serializable_hash
    elsif logged_in?
      date_event = nil
      if current_user.date_events.where(id: params[:id]).exists?
        date_event = current_user.date_events.find(params[:id])
      else
        date_event = DateEvent
          .visible_to(current_user)
          .includes(:profile)
          .where(Profile.build_interested_in_columns(current_user.try(:profile).sex))
          .where(profiles: { sex: current_user.profile.interested_in_sexes })
          .find(params[:id])
      end

      render json: DateEventSerializer.new(date_event, {
        include: [:profile]
      }).serializable_hash
    else
      date_event = DateEvent
        .appliable
        .includes(:profile)
        .find(params[:id])

      render json: DateEventSerializer.new(date_event, {
        include: [:profile]
      }).serializable_hash
    end
  end

  def show_slug
    date_event = DateEvent.where(profile_id: params[:profile_id]).friendly.find(params[:slug])

    render json: DateEventSerializer.new(date_event, {
      include: [:profile]
    }).serializable_hash
  end

  private def create_params
    params.require(:date_event).permit(
      :occurs_on_day,
      :starts_at,
      :ends_at,
      :category,
      :summary,
      :location,
      :region,
      :title,
      :sections
    )
  end
end