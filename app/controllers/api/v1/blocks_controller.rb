class Api::V1::BlocksController < Api::V1::ApplicationController
  before_action :require_login

  def index
    render json: {
      data: {
        profile_ids: Profile.where(user_id: current_user.block_users.pluck(:blocked_user_id)).pluck(:id)
      }
    }
  end

  def create
    get_block.first_or_create!

    render_blocked
  end

  def show
    if get_block.exists?
      render_blocked
    else
      render json: {
        data: {
          blocked: false
        }
      }
    end
  end

  def get_block
    BlockUser.where(
      blocked_by_id: current_user.id,
      blocked_user: Profile.select(:user_id).find(params[:profile_id]).user_id
    )
  end

  def render_blocked
    render json: {
      data: {
        blocked: true
      }
    }
  end

end