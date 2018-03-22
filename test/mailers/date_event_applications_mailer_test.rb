require 'test_helper'

class DateEventApplicationsMailerTest < ActionMailer::TestCase
  test "pick_someone" do
    mail = DateEventApplicationsMailer.pick_someone
    assert_equal "Pick someone", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "reminder" do
    mail = DateEventApplicationsMailer.reminder
    assert_equal "Reminder", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "new_date_event_application" do
    mail = DateEventApplicationsMailer.new_date_event_application
    assert_equal "New date event application", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "rate_your_date" do
    mail = DateEventApplicationsMailer.rate_your_date
    assert_equal "Rate your date", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
