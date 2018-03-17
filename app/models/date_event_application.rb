class DateEventApplication < ApplicationRecord
  belongs_to :profile, class_name: 'Profile', optional: true
  belongs_to :date_event

  enum approval_status: {
    filtered: -1,
    pending: 0,
    submitted: 1,
    rejected: 2,
    approved: 3,
    neutral: 4
  }

  enum confirmation_status: {
    pending_confirmation: 0,
    confirmed: 1,
    declined: 2
  }

  def date_event_phone
    if approved?
      date_event.profile.contact_via_phone? ? date_event.profile.phone : nil
    else
      nil
    end
  end

  alias_method :approved, :approved?

  DEFAULT_SECTIONS = [
    'introduction',
    'why'
  ]
end
