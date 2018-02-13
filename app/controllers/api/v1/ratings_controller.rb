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
      .order("created_at DESC")
      .where(status: status)
      .limit([Integer(params[:limit] || 25), 25].min)
      .offset([Integer(params[:offset] || 0), 0].max)
    
      render json: ReviewApplicationSerializer.new(applications, {
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
    render json: ReviewApplicationSerializer.new(application).serializable_hash
  end

  def show
    application = current_user
      .profile
      .applications
      .find(params[:id])

    render json: ReviewApplicationSerializer.new(application).serializable_hash
  end


end