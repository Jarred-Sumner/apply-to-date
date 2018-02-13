class ApplicationsMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.applications_mailer.approved.subject
  #
  def approved
    @greeting = "Hi"

    mail to: "jarred@jarredsumner.com"
  end

  def confirmed
    @greeting = "Hi"

    mail to: "jarred@jarredsumner.com"
  end
end
