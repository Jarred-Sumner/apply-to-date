class Profile < ApplicationRecord
  belongs_to :user
  validates :id, presence: true, uniqueness: true
  has_many :verified_networks
  has_many :applications
  has_many :external_authentications, through: :verified_networks

  DEFAULT_SECTIONS = [
    'introduction',
    'background',
    'looking-for',
    'not-looking-for'
  ]

  scope :visible, lambda { where(visible: true) }
  scope :discoverable, lambda { visible.where(appear_in_discover: true) }
  scope :matchmakable, lambda { visible.where(appear_in_matchmake: true) }
  scope :filled_out, lambda {where("array_length(photos, 1) >= 1 AND (#{Profile.sections_sql_selectors_not_empty} OR #{Profile.has_social_links_query})") }

  scope :nearby, lambda { |profile| within(100, origin: [profile.latitude, profile.longitude]) }
  scope :interested_in, lambda { |interested_in| where(Profile.build_interested_in_columns(interested_in)) }
  scope :compatible_with, lambda { |profile| interested_in(profile.sex).where(sex: profile.interested_in_sexes).nearby(profile) }
  scope :bio_contains, lambda { |string| where(Profile.sections_contain_query(string)) }
  scope :empty_bio, lambda { where(Profile.sections_sql_selectors_empty) }

  def self.count_all_possible_pairs
    counted_pairs = []
    Profile
      .matchmakable
      .filled_out
      .to_a
      .map do |profile|
        possible_count = profile.count_possible_pairs(counted_pairs.map { |pair| [pair, profile.id]})
        counted_pairs.push(profile.id)

        possible_count
      end.sum
  end

  def count_possible_pairs(exclude = [])
    Matchmake.fetch_right(left_profile: self).to_a.select { |right_profile| Matchmake.can_pair?(self, right_profile, exclude) }.length
  end

  def self.sections_sql_selectors
    DEFAULT_SECTIONS.map do |section_key|
      "sections->>'#{section_key}'"
    end
  end

  def self.sections_contain_query(string)
    sections_sql_selectors
      .map { |selector| "#{selector} ilike #{ActiveRecord::Base.connection.quote("%" + string + "%")}" } 
      .join(" OR ")
  end

  def self.social_links_sql_selectors
    ExternalAuthentication::ALLOWED_SOCIAL_LINKS.map do |key|
      "social_links ->> #{ActiveRecord::Base.connection.quote(key)}"
    end
  end

  def self.has_social_links_query
    social_links_sql_selectors.map do |selector|
      " (#{selector} != '' AND #{selector} IS NOT NULL) "
    end.join(" OR ")
  end


  def self.sections_sql_selectors_not_empty
    DEFAULT_SECTIONS.map do |section_key|
      " sections->>'#{section_key}' != '' "
    end.join(" OR ")
  end

  def self.sections_sql_selectors_empty
    DEFAULT_SECTIONS.map do |section_key|
      " sections->>'#{section_key}' = '' "
    end.join(" AND ")
  end

  def self.build_interested_in_columns(interested_in)
    columns = []
    if !interested_in.respond_to?(:each)
      columns = [interested_in]
    else
      columns = interested_in
    end

    columns.map { |gender| "#{User.interested_in_column_name(gender, "profiles")} = TRUE" }.join(" OR ")
  end

  def geocode
    @geocode ||= Geokit::Geocoders::MultiGeocoder.geocode(location)
  end

  def update_from_geocode
    return nil if location.blank?

    self.latitude = geocode.lat
    self.longitude = geocode.lng
    self.save!(touch: false)
  end

  def interested_in_sexes
    User::VALID_SEXES
      .reject { |sex| sex === 'male' && !interested_in_men? }
      .reject { |sex| sex === 'female' && !interested_in_women? }
      .reject { |sex| sex === 'other' && !interested_in_other? }
  end

  acts_as_mappable :default_units => :miles,
                   :default_formula => :sphere,
                   :lat_column_name => :latitude,
                   :lng_column_name => :longitude

  def self.real
    Profile.where(visible: true).where(user_id: User.real_accounts.pluck(:id)).where("array_length(photos, 1) > 0")
  end

  def could_be_interested_in?(profile)
    interested_in_sexes.include?(profile.sex)
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
