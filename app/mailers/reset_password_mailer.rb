class ResetPasswordMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.reset_password_mailer.rreset_password_email.subject
  #
  def reset_password_email(user_id)
    user = User.find(user_id)
    @reset_password_url = Api::V1::ApplicationController.build_frontend_uri(
      "/reset-password/#{user.reset_password_token}",
      {}
    )

    mail to: user.email, subject: "Reset your Apply to Date password"
  end
end
