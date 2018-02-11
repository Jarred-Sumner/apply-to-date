class Application < ApplicationRecord
  has_many :verified_networks
  has_many :external_authentications, through: :verified_networks

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
  validates :profile, presence: true, :unless => :pending?
  validates :name, presence: true, :unless => :pending?
  validates :social_links, presence: true, :unless => :pending?
  validates :sex, presence: true, inclusion: { in: ['male', 'female', 'other'] }, unless: :pending?

  before_validation on: :create do
    self.user ||= profile.user
  end

  before_create do
    self.email.downcase!
  end
end
