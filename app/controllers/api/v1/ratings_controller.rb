class Api::V1::RatingsController < Api::V1::ApplicationController
  before_action :require_login

  def index
    status = String(params[:status]).split(",")

    unless status.all? { |current_status| Application.approval_statuses[current_status].present? }
      status = Application.approval_statuses[:submitted]
    end

    count = current_user
      .profile
      .applications
      .order("created_at DESC")
      .where(status: status)
      .count

    applications = current_user
      .profile
      .applications
      .includes(:external_authentications, :applicant_profile)
      .order("created_at DESC")
      .where(status: status)
      .limit([Integer(params[:limit] || 100), 100].min)
      .offset([Integer(params[:offset] || 0), 0].max)

      render json: ReviewApplicationSerializer.new(applications, {
        include: [
          :external_authentications,
          :applicant_profile
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
          :external_authentications,
          :applicant_profile
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
      .includes(:external_authentications, :applicant_profile)
      .find(params[:id])

    render json: ReviewApplicationSerializer.new(application, {
      include: [
          :external_authentications,
          :applicant_profile
      ],
    }).serializable_hash
  end


end