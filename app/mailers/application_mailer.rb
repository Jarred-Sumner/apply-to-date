class ApplicationMailer < ActionMailer::Base
  add_template_helper(ApplicationHelper)
  default from: 'Apply to Date <notifs@applytodate.com>'
  layout 'mailer'
end
