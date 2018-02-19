class Profile < ApplicationRecord
  belongs_to :user
  validates :id, presence: true, uniqueness: true
  has_many :verified_networks
  has_many :applications
  has_many :external_authentications, through: :verified_networks
  validates :recommended_contact_method, presence: true, inclusion: { in: ['phone', 'twitter', 'instagram', 'facebook'] }, :unless => :draft?
  validate :recommended_contact_method_exists, if: :visible?

  def recommended_contact_method_exists
    if contact_method_value.blank? && recommended_contact_method.present?
      if contact_via_phone?
        errors.add(:phone, "- please enter your phone number")
      else
        errors.add(:recommended_contact_method, "- please connect your #{recommended_contact_method.capitalize} account")
      end
    end
  end
  
  validates :tagline, presence: true, :if => :visible?
  validates :photos, presence: true, :if => :visible?

  CONTACT_METHOD_LABEL = {
    phone: "text message",
    twitter: "DM on Twitter",
    instagram: "DM on Instagram",
    facebook: "FB Messenger",
  }.with_indifferent_access

  def contact_method_label
    CONTACT_METHOD_LABEL[recommended_contact_method]
  end

  def contact_via_phone?
    recommended_contact_method == 'phone'
  end

  def recommended_external_authentication
    @recommended_external_authentication ||= external_authentications.where(provider: recommended_contact_method).order('created_at DESC').first
  end

  def contact_method_value
    if contact_via_phone?
      phone
    else
      recommended_external_authentication.try(:url)
    end
  end

  DEFAULT_SECTIONS = [
    'introduction',
    'background',
    'looking-for',
    'not-looking-for'
  ]

  def draft?
    !visible?
  end

  def url
    Rails.application.secrets[:frontend_url] + '/' + id
  end

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
