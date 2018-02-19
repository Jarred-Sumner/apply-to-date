class ApplicationsMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.applications_mailer.approved.subject
  #
  def approved(application_id)
    @application = Application.find(application_id)
    @profile = @application.profile
    @profile_url = Api::V1::ApplicationController.build_frontend_uri(
      "/#{@profile.id}",
      {}
    )
    
    mail to: @application.email, subject: "#{@profile.name} wants to go on a date with you."
  end

  def pending_app(application_id)
    @application = Application.find(application_id)
    @profile = @application.profile
    @profile_name = @profile.name

    @gender_name = @application.sex == 'male' ? 'him' : 'her'
    @gender_name = "them" if @application.sex != 'male' && @application.sex != 'female'
    @application_url = Api::V1::ApplicationController.build_frontend_uri(
      "/applications/#{@application.id}",
      {}
    )

    mail to: @profile.user.email, subject: "#{@application.name} asked you out!"
  end

  def confirmed(application_id)
    @application = Application.find(application_id)
    @profile = @application.profile
    @profile_name = @profile.name

    mail to: @application.email, subject: "You asked out #{@profile_name}"
  end
  
end
