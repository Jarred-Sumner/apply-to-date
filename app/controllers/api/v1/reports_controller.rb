class Api::V1::ReportsController < Api::V1::ApplicationController
  before_action :require_login, :check_reportable_type

  def create
    get_report.first_or_create!

    render_reported
  end

  def show
    if get_report.exists?
      render_reported
    else
      render json: {
        data: {
          reported: false
        }
      }
    end
  end

  def get_report
    Report.where(
      reportable_type: params[:reportable_type],
      reportable_id: params[:reportable_id],
      user_id: current_user.id,
    )
  end

  def render_reported
    render json: {
      data: {
        reported: true
      }
    }
  end

  def check_reportable_type
    if !Report::VALID_REPORTABLE_TYPES.include?(params[:reportable_type])
      render_error(message: "#{params[:reportable_type]} must be one of #{Report::VALID_REPORTABLE_TYPES.join(",")}")
    end
  end
end