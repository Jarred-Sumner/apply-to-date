class DateEventApplicationsMailer < ApplicationMailer
  layout 'emails'
  add_template_helper(DateEventApplicationHelper)
  include ApplicationHelper
  include DateEventApplicationHelper
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.date_event_applications_mailer.pick_someone.subject
  #
  def pick_someone

  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.date_event_applications_mailer.reminder.subject
  #
  def reminder

  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.date_event_applications_mailer.new_date_event_application.subject
  #
  def new_date_event_application(notification_id)
    @notification = Notification.find(notification_id)
    @date_event_application = @notification.notifiable
    @user = @notification.user

    return if !@notification.should_send_email?

    @gender_name = him_her_them(@date_event_application.sex)
    @url = Api::V1::ApplicationController.build_frontend_uri(
      "/dates/#{@date_event_application.date_event_id}/pick-someone/#{@date_event_application.id}",
      {}
    )

    @emoji = emoji_label(@date_event_application)
    @label = category_label(@date_event_application)
    @formatted_time = format_date_event_time(@date_event_application)
    subject_line = [
      "#{@date_event_application.name} wants to #{@emoji} #{@label} with you",
      "#{@emoji} with #{@date_event_application.name} #{@formatted_time}?",
    ].sample

    @notification.update!(email_sent_at: DateTime.now)

    mail to: @user.email, subject: subject_line
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
