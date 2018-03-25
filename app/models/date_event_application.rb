class DateEventApplication < ApplicationRecord
  belongs_to :profile, class_name: 'Profile', optional: true
  belongs_to :date_event
  has_one :application

  enum approval_status: {
    filtered: -1,
    pending: 0,
    submitted: 1,
    rejected: 2,
    approved: 3,
    swap_date: 4
  }

  enum confirmation_status: {
    pending_confirmation: 0,
    confirmed: 1,
    declined: 2
  }

  def approved!
    return self if approved?
    ActiveRecord::Base.transaction do
      date_event.date_event_applications
        .where(approval_status: [DateEventApplication.approval_statuses[:pending], DateEventApplication.approval_statuses[:submitted]])
        .where
        .not(id: id)
        .update_all(approval_status: DateEventApplication.approval_statuses[:rejected])

      update!(approval_status: DateEventApplication.approval_statuses[:approved])

      notification = Notification.create!(
        notifiable: date_event,
        user: profile.user,
        kind: Notification.kinds[:please_rsvp_to_date_event],
        occurred_at: DateTime.now,
        expires_at: date_event.occurs_on_day + 24.hours,
      )

      notification.enqueue_email!
    end
  end

  def swap_date!(category)
    return self if swap_date?

    ActiveRecord::Base.transaction do
      update!(approval_status: DateEventApplication.approval_statuses[:swap_date])

      application = Application.create!({
        applicant_id: profile.user_id,
        profile_id: date_event.profile_id,
        sections: sections.merge(profile.sections),
        social_links: social_links,
        photos: photos,
        sex: sex,
        location: profile.location,
        latitude: profile.latitude,
        longitude: profile.longitude,
        phone: phone,
        email: email,
        name: name,
        status: Application.statuses[:approved],
        category: category,
        date_event_application: self
      })

      notification = Notification.create!({
        notifiable: application,
        user: profile.user,
        kind: Notification.kinds[:swapped_date_event],
        occurred_at: DateTime.now,
      })

      notification.enqueue_email!
    end
  end

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
