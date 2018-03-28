class Notification < ApplicationRecord
  belongs_to :user, counter_cache: true
  belongs_to :notifiable, polymorphic: true
  validates :occurred_at, presence: true

  def devices
    Device.push_enabled.where(user_id: user_id)
  end

  enum kind: {
    new_application: 0,
    approved_application: 1,
    profile_viewed: 2,
    new_date_event_application: 3,
    please_rsvp_to_date_event: 4,
    swapped_date_event: 5,
    pick_someone: 6,
  }

  def should_send_email?
    if should_dismiss?
      dismissed!
      Rails.logger.info "DISMISSING NOTIFICATION FROM EMAIL: #{id}"
    end

    email_sent_at.nil? && unread?
  end

  def should_send_push?
    if should_dismiss?
      dismissed!
      Rails.logger.info "DISMISSING NOTIFICATION FROM EMAIL: #{id}"
    end

    push_sent_at.nil? && unread?
  end


  def enqueue_email!
    if new_application?
      ApplicationsMailer.pending_app(notifiable.id, id).deliver_later(wait: 30.minutes)
    elsif new_date_event_application?
      DateEventApplicationsMailer.new_date_event_application(notifiable.id).deliver_later(wait: 30.minutes)
    elsif pick_someone?
    end
  end

  def enqueue_push!
    PushNotificationWorker.perform_async(id)
  end

  def deliver_push!(device)
    if new_date_event_application?
      NewDateEventApplicationNotification.new(device).perform(self)
    elsif new_application?
      NewApplicationNotification.new(device).perform(self)
    end
  end

  def enqueue!
    return if !unread?

    enqueue_email!
    enqueue_push!
  end

  enum status: {
    unread: 0,
    read: 1,
    expired: 2,
    dismissed: 3,
  }

  validates :status, presence: true
  validates :kind, presence: true

  def should_dismiss?
    if new_date_event_application?
      date_event_application = notifiable
      return !(date_event_application.submitted? || date_event_application.pending?) && date_event_application.date_event.can_still_choose_someone?
    elsif new_application?
      application = notifiable
      return !(application.pending? || application.submitted?)
    elsif please_rsvp_to_date_event?
      date_event = notifiable
      date_event_application = date_event.date_event_applications.find_by(profile_id: user.username)
      !date_event_application.pending_confirmation? || !date_event_application.approved?
    elsif pick_someone?
      date_event = notifiable

      !date_event.scheduled?
    else
      return false
    end
  end

  def build_meta
    if new_application?
      {
        name: notifiable.name,
        thumbnail: notifiable.photos.try(:first)
      }
    elsif approved_application?
      {
        name: notifiable.name,
        thumbnail: notifiable.photos.try(:first)
      }
    elsif profile_viewed?
      {
        name: notifiable.name,
        thumbnail: notifiable.photos.try(:first)
      }
    elsif new_date_event_application?
      {
        name: notifiable.name,
        thumbnail: notifiable.photos.try(:first),
        category: notifiable.date_event.category,
      }
    elsif please_rsvp_to_date_event?
      {
        name: notifiable.profile.name,
        thumbnail: notifiable.profile.photos.try(:first),
        category: notifiable.category,
      }
    elsif swapped_date_event?
      {
        name: notifiable.profile.name,
        thumbnail: notifiable.profile.photos.try(:first),
        category: notifiable.category,
      }
    else

    end
  end

  before_validation on: :create do
    self.meta = build_meta
    self.occurred_at ||= DateTime.now
  end
end
