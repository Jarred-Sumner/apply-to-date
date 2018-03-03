class Api::V1::NotificationsController < Api::V1::ApplicationsController
  before_action :require_login

  def index
    render json: NotificationSerializer.new(current_user.notifications.order("created_at DESC")).serializable_hash
  end

  def update
    notification = current_user.notifications.find(params[:id])
    if update_params[:status] == 'read' && notification.unread?
      notification.read!
    end

    render json: NotificationSerializer.new(notification).serializable_hash
  end

  private def update_params
    params.require(:notification).permit(:status)
  end

end