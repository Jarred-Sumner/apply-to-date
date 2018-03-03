class Notification < ApplicationRecord
  belongs_to :user, counter_cache: true
  belongs_to :notifiable, polymorphic: true

  enum kind: {
    new_application: 0,
    approved_application: 1,
    profile_viewed: 2,
  }

  def enqueue_email!
    if new_application?
      ApplicationsMailer.pending_app(notifiable.id, id).deliver_later
    end
  end

  enum status: {
    unread: 0,
    read: 1,
    expired: 2
  }

  validates :status, presence: true, inclusion: { in: Notification.statuses.values }
  validates :kind, presence: true, inclusion: { in: Notification.kinds.values }
end
