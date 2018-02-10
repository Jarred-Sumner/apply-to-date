class Profile < ApplicationRecord
  belongs_to :user
  validates :id, presence: true, uniqueness: true
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

  before_validation on: :create do
    self.sections = Profile.build_default_sections
    self.social_links = {}
    self.photos = []
  end
end
