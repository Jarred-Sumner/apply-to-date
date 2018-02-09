# Preview all emails at http://localhost:3000/rails/mailers/applications_mailer
class ApplicationsMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/applications_mailer/approved
  def approved
    ApplicationsMailer.approved
  end

end
