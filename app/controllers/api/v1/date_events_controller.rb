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
        profile_id: profile.id,
        status: DateEvent.statuses[:scheduled],
        region: DateEvent.regions[create_params[:region]],
        occurs_on_day: occurs_on_day.to_date,
      )
    )
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
      :region,
      :title,
      :sections
    )
  end
end