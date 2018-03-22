# Preview all emails at http://localhost:3000/rails/mailers/date_event_applications_mailer
class DateEventApplicationsMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/date_event_applications_mailer/pick_someone
  def pick_someone
    DateEventApplicationsMailer.pick_someone
  end

  # Preview this email at http://localhost:3000/rails/mailers/date_event_applications_mailer/reminder
  def reminder
    DateEventApplicationsMailer.reminder
  end

  # Preview this email at http://localhost:3000/rails/mailers/date_event_applications_mailer/new_date_event_application
  def new_date_event_application
    DateEventApplicationsMailer.new_date_event_application
  end

  # Preview this email at http://localhost:3000/rails/mailers/date_event_applications_mailer/rate_your_date
  def rate_your_date
    DateEventApplicationsMailer.rate_your_date
  end

end
