class ResetPasswordMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.reset_password_mailer.rreset_password_email.subject
  #
  def rreset_password_email
    @greeting = "Hi"

    mail to: "to@example.org"
  end
end
