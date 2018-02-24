class Profile < ApplicationRecord
  belongs_to :user
  validates :id, presence: true, uniqueness: true
  has_many :verified_networks
  has_many :applications
  has_many :external_authentications, through: :verified_networks
  scope :interested_in, lambda { |interested_in| where(Profile.build_interested_in_columns(interested_in)) }

  def self.build_interested_in_columns(interested_in)
    columns = []
    if !interested_in.respond_to?(:each)
      columns = [interested_in]
    else
      columns = interested_in
    end

    columns.map { |gender| "#{User.interested_in_column_name(gender, "profiles")} = TRUE" }.join(" OR ")
  end

  acts_as_mappable :default_units => :miles,
                   :default_formula => :sphere,
                   :lat_column_name => :latitude,
                   :lng_column_name => :longitude

  def self.real
    Profile.where(visible: true).where(user_id: User.real_accounts.pluck(:id)).where("array_length(photos, 1) > 0").where("social_links != '{}'")
  end

  def could_be_interested_in?(profile)
    user.interested_in_sexes.include?(profile.sex)
  end
  
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

  def build_default_photo_url
    if facebook = external_authentications.find_by(provider: 'facebook')
      facebook.build_facebook_photo_url
    elsif twitter = external_authentications.find_by(provider: 'twitter')
      twitter.build_twitter_photo_url
    end
  end

  def all_social_networks
    links = social_links.dup

    external_authentications.each do |auth|
      links[auth.provider] = auth.url
    end

    links
  end

  before_validation on: :create do
    self.sections = Profile.build_default_sections
    self.social_links ||= {}
    self.photos ||= []
    self.tags ||= []
    self.interested_in_men = user.interested_in_men? if interested_in_men.nil?
    self.interested_in_women = user.interested_in_women? if interested_in_women.nil?
    self.interested_in_other = user.interested_in_other? if interested_in_other.nil?
    self.sex ||= user.sex
  end

end
