class Application < ApplicationRecord
  has_many :verified_networks
  has_many :external_authentications, through: :verified_networks

  DEFAULT_SECTIONS = [
    'introduction',
    'why'
  ]

  def self.submission_statuses
    {
      :pending => 0,
      :submitted => 1
    }.with_indifferent_access
  end

  def self.approval_statuses
    {
      :rejected => Application.statuses[:rejected],
      :submitted => Application.statuses[:submitted],
      :new => Application.statuses[:submitted],
      :approved => Application.statuses[:approved],
      :neutral => Application.statuses[:neutral],
    }.with_indifferent_access
  end

  enum status: {
    pending: 0,
    submitted: 1,
    rejected: 2,
    approved: 3,
    neutral: 4
  }

  belongs_to :applicant, optional: true
  belongs_to :user
  belongs_to :profile, counter_cache: true

  validates :sections, presence: true
  validates :email, presence: true, uniqueness: { scope: [:user_id] }
  validates :profile, presence: true
  validates :name, presence: true, :unless => :pending?
  validates :sex, presence: true, inclusion: { in: ['male', 'female', 'other'] }, unless: :pending?

  def self.fetch(email: nil, profile_id: nil)
    profile = Profile.find_by(id: profile_id, visible: true)
    if profile.nil?
      return nil
    end

    application = Application.where(
      email: String(email),
      profile_id: profile.id
    ).first_or_initialize
    application.save! unless application.persisted?

    return application
  end

  def self.build_default_sections
    DEFAULT_SECTIONS.map { |s| [s, '']}.to_h
  end

  def build_default_sections
    sections = self.sections || {}

    DEFAULT_SECTIONS.map { |s| [s, sections[s] || '']}.to_h
  end

  def self.leaderboard
    fake_emails = User::PROBABLY_FAKE_ACCOUNTS.map { |email| "%#{email}%"}
    Application.where("status > 0").where.not("email ~~ ANY('{#{fake_emails.join(",")}}')").select('profile_id').group(:profile_id).having("count(profile_id) > 0").order("count(profile_id) DESC").count
  end

  before_validation on: :create do
    self.user ||= profile.user
    self.sections = build_default_sections
  end

end
