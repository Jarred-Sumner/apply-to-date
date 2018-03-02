class ApplicationMailer < ActionMailer::Base
  add_template_helper(ApplicationHelper)
  layout 'mailer'

  def self.default_from
    'Apply to Date <notifs@applytodate.com>'
  end

  default from: ApplicationMailer.default_from
end
