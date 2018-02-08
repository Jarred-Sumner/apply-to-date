class Application < ApplicationRecord
  enum status: {
    pending: 0,
    submitted: 1,
    rejected: 2,
    approved: 3,
    meh: 4
  }

  belongs_to :applicant, optional: true
  belongs_to :user
  belongs_to :profile

  validates :email, presence: true, uniqueness: { scope: [:user_id] }
  validates :profile, presence: true
  validates :name, presence: true
  validates :social_links, presence: true

  before_validation on: :create do
    self.user ||= profile.user
  end

  before_create do
    self.email.downcase!
  end
end
