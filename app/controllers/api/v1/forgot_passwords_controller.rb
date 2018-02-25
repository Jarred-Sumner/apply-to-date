class Api::V1::ForgotPasswordsController < Api::V1::ApplicationController

  def create
    if params[:username].blank?
      raise ArgumentError.new("Please provide an email or username")
    end

    username = String(params[:username]).strip
    user = User.where("username = ? OR email = ?", username, username).first
    
    if user.nil?
      raise ArgumentError.new("Please re-enter the email/username and try again")
    end

    user.generate_reset_password_token!

    ResetPasswordMailer.reset_password_email(user.id).deliver_later

    render json: {
      data: nil
    }
  rescue ArgumentError => e
    render_error(message: e.message)
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end
end