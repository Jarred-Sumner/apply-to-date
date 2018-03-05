class Api::V1::RatingsController < Api::V1::ApplicationController

  def index
    status = String(params[:status])
    status = Application.approval_statuses[:submitted] unless Application.approval_statuses[status].present?

    count = current_user
      .profile
      .applications
      .order("created_at DESC")
      .where(status: status)
      .count

    applications = current_user
      .profile
      .applications
      .includes(:external_authentications)
      .order("created_at DESC")
      .where(status: status)
      .limit([Integer(params[:limit] || 25), 25].min)
      .offset([Integer(params[:offset] || 0), 0].max)

      render json: ReviewApplicationSerializer.new(applications, {
        include: [
          :external_authentications
        ],
        meta: {
          total: count,
        }
      }).serializable_hash
  end

  def update
    status = Application.approval_statuses[String(params[:status])]
    raise ArgumentError.new("Please specify approved, rejected, or neutral") if status.blank?

    application = current_user
      .profile
      .applications
      .find(params[:id])

    application.update!(status: status)

    application.notifications.new_application.unread.update_all(status: Notification.statuses[:read])

    if status == Application.statuses[:approved]
      ApplicationsMailer.approved(application.id).deliver_later
    end

    render json: ReviewApplicationSerializer.new(application, {
      include: [
          :external_authentications
      ],
      meta: {
        unread_notification_count: current_user.notifications.unread.count
      }
    }).serializable_hash
  end

  def show
    application = current_user
      .profile
      .applications
      .includes(:external_authentications)
      .find(params[:id])

    render json: ReviewApplicationSerializer.new(application, {
      include: [
          :external_authentications
      ],
    }).serializable_hash
  end


end