class Profile < ApplicationRecord
  belongs_to :user
  validates :id, presence: true, uniqueness: true
  has_many :verified_networks
  has_many :applications
  has_many :notifications, as: :notifiable
  has_many :external_authentications, through: :verified_networks
  has_many :reports, as: :reportable
  has_many :date_event_applications
  has_many :views, class_name: 'ProfileView', foreign_key: 'profile_id'
  has_many :viewed, class_name: 'ProfileView', foreign_key: 'viewed_by_profile_id'

  MINIMUM_DISTANCE_TO_REGION = 100.0

  enum region: {
    bay_area: 0,
    boston: 1,
    new_york: 2
  }

  DEFAULT_SECTIONS = [
    'introduction',
    'background',
    'looking-for',
    'not-looking-for'
  ]

  scope :visible, lambda { where(visible: true) }
  scope :featured, lambda { where(featured: true) }
  scope :discoverable, lambda { visible.where(appear_in_discover: true) }
  scope :matchmakable, lambda { visible.where(appear_in_matchmake: true) }
  scope :filled_out, lambda {where("array_length(photos, 1) >= 1 AND (#{Profile.sections_sql_selectors_not_empty} OR #{Profile.has_social_links_query})") }

  scope :nearby, lambda { |profile| within(100, origin: [profile.latitude, profile.longitude]) }
  scope :interested_in, lambda { |interested_in| where(Profile.build_interested_in_columns(interested_in)) }
  scope :sexually_compatible_with, lambda { |profile| interested_in(profile.sex).where(sex: profile.interested_in_sexes) }
  scope :compatible_with, lambda { |profile| sexually_compatible_with(profile).nearby(profile) }
  scope :bio_contains, lambda { |string| where(Profile.sections_contain_query(string)) }
  scope :empty_bio, lambda { where(Profile.sections_sql_selectors_empty) }

  scope :real, lambda { visible.filled_out.where.not(user_id: User.fake.pluck(:id)) }

  def change_username(username)
    ActiveRecord::Base.transaction do
      new_profile = Profile.create!(self.attributes.merge(
        id: username
      ))

      verified_networks.update_all(profile_id: username)
      applications.update_all(profile_id: username)
      notifications.update_all(notifiable_id: username)
      reports.update_all(reportable_id: username)
      Matchmake.where(left_profile_id: id).update_all(left_profile_id: username)
      Matchmake.where(right_profile_id: id).update_all(right_profile_id: username)
      user.update!(username: username)

      self.destroy

      new_profile
    end
  end

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

  def formatted_phone
    if Phonelib.valid?(phone)
      Phonelib.parse(phone).national
    else
      phone
    end
  end

  def contact_method_value
    if contact_via_phone?
      formatted_phone
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
    ExternalAuthentication.build_default_photo_url(external_authentications)
  end

  def all_social_networks
    links = social_links.dup

    external_authentications.each do |auth|
      links[auth.provider] = auth.url
    end

    links
  end

  VALID_CONTACT_METHODS = [
    'twitter',
    'facebook',
    'instagram',
    'phone'
  ]

  def distance_to_regions
    DateEvent::REGION_CENTERS.map do |key, coords|
      [key, distance_to(coords)]
    end.to_h
  end

  def closest_region
    distance_to_regions.min_by(&:last)
  end

  def default_region
    return nil if latitude.blank? || longitude.blank?

    region, distance = closest_region
    if region.present? && distance < MINIMUM_DISTANCE_TO_REGION
      self.region = region
    else
      nil
    end
  end

  validates :recommended_contact_method, inclusion: { in: VALID_CONTACT_METHODS }, allow_blank: true

  before_validation on: :create do
    self.sections = Profile.build_default_sections
    self.social_links ||= {}
    self.photos ||= []
    self.tags ||= []
    self.interested_in_men = user.interested_in_men? if interested_in_men.nil?
    self.interested_in_women = user.interested_in_women? if interested_in_women.nil?
    self.interested_in_other = user.interested_in_other? if interested_in_other.nil?
    self.sex ||= user.sex

    if !VALID_CONTACT_METHODS.include?(self.recommended_contact_method)
      self.recommended_contact_method = 'phone'
    end

    self.region = default_region
  end

end
