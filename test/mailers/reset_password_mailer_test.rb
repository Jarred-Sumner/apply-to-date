require 'test_helper'

class ResetPasswordMailerTest < ActionMailer::TestCase
  test "rreset_password_email" do
    mail = ResetPasswordMailer.rreset_password_email
    assert_equal "Rreset password email", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
