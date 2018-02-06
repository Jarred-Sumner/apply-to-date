class Api::V1::ProfilesController < Api::V1::ApplicationController
  before_action :require_login, only: :update

  def show
    profile = Profile.find(params[:id])

    render_profile(profile)
  end

  def update

  end

  def render_profile(profile)
    render json: ProfileSerializer.new(profile).serializable_hash
  end
end