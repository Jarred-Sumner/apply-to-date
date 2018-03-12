class Api::V1::ProfileViewsController < Api::V1::ApplicationController
  before_action :require_login

  def create
    profile = Profile.includes(:user).find(String(params[:profile_id]))

    profile_view = current_user.viewed_users.where(
      profile_id: profile.id,
      user_id: profile.user_id
    ).first_or_initialize

    profile_view.update!(
      last_viewed_at: DateTime.now,
      view_count: profile_view.view_count + 1,
      viewed_by_profile_id: current_user.username
    )

    render_success
  end

  def render_success
    render json: {
      data: {
        success: true
      }
    }
  end

end