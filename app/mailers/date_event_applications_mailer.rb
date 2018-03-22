class DateEventApplicationsMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.date_event_applications_mailer.pick_someone.subject
  #
  def pick_someone
    @greeting = "Hi"

    mail to: "to@example.org"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.date_event_applications_mailer.reminder.subject
  #
  def reminder
    @greeting = "Hi"

    mail to: "to@example.org"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.date_event_applications_mailer.new_date_event_application.subject
  #
  def new_date_event_application
    @greeting = "Hi"

    mail to: "to@example.org"
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.date_event_applications_mailer.rate_your_date.subject
  #
  def rate_your_date
    @greeting = "Hi"

    mail to: "to@example.org"
  end
end
