class UsersMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.users_mailer.welcome.subject
  #
  def welcome
    @greeting = "Hi"

    mail to: "lucyguo94@gmail.com", subject: "Welcome to Apply to Date"
  end
end