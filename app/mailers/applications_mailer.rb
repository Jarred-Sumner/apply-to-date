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

  def pending_app(application_id)
    @application = Application.find(application_id)
    @profile = @application.profile
    @profile_name = @profile.name

    mail to: @profile.user.email, subject: "#{@application.name} asked you out!"
  end

  def confirmed(application_id)
    @application = Application.find(application_id)
    @profile = @application.profile
    @profile_name = @profile.name

    mail to: @application.email, subject: "Thanks for asking out #{@profile_name}"
  end
end
