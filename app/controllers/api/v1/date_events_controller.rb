class Api::V1::DateEventsController < Api::V1::ApplicationController
  before_action :require_login, except: :show

  def index
    if params[:profile_id] == 'me'
      date_events = current_user
        .date_events
        .order("occurs_on_day ASC, starts_at ASC")
        .limit(100)

      render json: DateEventSerializer.new(date_events).serializable_hash
    elsif params[:region].present?
      region = String(params[:region])
      time_zone = DateEvent.time_zone(region)

      date_events = DateEvent
        .where(region: DateEvent.regions[region])
        .where(status: DateEvent.statuses[:scheduled])
        .where("occurs_on_day >= ?", time_zone.now.to_date)
        .where("starts_at IS NULL OR starts_at > ?", time_zone.now.to_time)
        .where.not(user_id: current_user.blocked_by_users.pluck(:id))
        .includes(:profile)
        .where(Profile.build_interested_in_columns(current_user.profile.sex))
        .where(profiles: { sex: current_user.profile.interested_in_sexes })
        .order("occurs_on_day ASC, starts_at ASC")
        .limit(100)

      render json: DateEventSerializer.new(date_events, {
        include: [:profile]
      }).serializable_hash
    elsif params[:id].present?
      date_events = DateEvent.where(id: Array(params[:id]))

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

  def choose
    de_application = current_user
        .date_events
        .find(params[:id])
        .date_event_applications
        .find(params[:date_event_application_id])

    if date_event.can_still_choose_someone?
      if !de_application.approved?
        de_application.approved!
        notification = Notification.create!(
          notifiable: de_application,
          user: de_application.applicant,
          occured_at: DateTime.now,
        )

        notification.enqueue_email!

        render json: DateEventApplicationSerializer.new(de_application).serializable_hash
      end
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
      date_event.location = date_event.location
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
    else
      date_event = DateEvent
        .where.not(user_id: current_user.blocked_by_users.pluck(:id))
        .includes(:profile)
        .where(Profile.build_interested_in_columns(current_user.profile.sex))
        .where(profiles: { sex: current_user.profile.interested_in_sexes })
        .find(params[:id])

      render json: DateEventSerializer.new(date_event, {
        include: [:profile]
      }).serializable_hash
    end
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