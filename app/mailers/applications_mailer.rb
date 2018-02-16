class ApplicationsMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.applications_mailer.approved.subject
  #
  def approved(application_id)
    @application = Application.find(application_id)
    @profile = @application.profile

    mail to: @application.email, subject: "#{@profile.name} wants to go on a date with you."
  end

  def confirmed(application_id)
    @application = Application.find(application_id)
    @profile = @application.profile

    mail to: @application.email, subject: "It takes courage to ask someone out"
  end
end
