class Profile < ApplicationRecord
  belongs_to :user
  validates :id, presence: true, uniqueness: true
  belongs_to :recommended_contact_method, class_name: ExternalAuthentication
  has_many :verified_networks
  has_many :external_authentications, through: :verified_networks

  DEFAULT_SECTIONS = [
    'introduction',
    'background',
    'looking-for',
    'not-looking-for'
  ]

  def self.build_default_sections
    DEFAULT_SECTIONS.map do |section|
      [section, '']
    end.to_h
  end

  def build_recommended_contact_methods
    external_authentications.pluck(:provider)
  end

  before_validation on: :create do
    self.sections = Profile.build_default_sections
    self.social_links ||= {}
    self.photos ||= []
    self.tags ||= []
  end

end
