# Preview all emails at http://localhost:3000/rails/mailers/reset_password_mailer
class ResetPasswordMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/reset_password_mailer/rreset_password_email
  def rreset_password_email
    ResetPasswordMailer.rreset_password_email
  end

end
