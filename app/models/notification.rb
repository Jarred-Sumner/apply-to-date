class Notification < ApplicationRecord
  belongs_to :user, counter_cache: true
  belongs_to :notifiable, polymorphic: true
  validates :occurred_at, presence: true

  enum kind: {
    new_application: 0,
    approved_application: 1,
    profile_viewed: 2,
    new_date_event_application: 3,
    please_rsvp_to_date_event: 4,
    swapped_date_event: 5
  }

  def enqueue_email!
    if new_application?
      ApplicationsMailer.pending_app(notifiable.id, id).deliver_later
    end
  end

  enum status: {
    unread: 0,
    read: 1,
    expired: 2,
    dismissed: 3,
  }

  validates :status, presence: true
  validates :kind, presence: true

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
        category: notifiable.category,
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
