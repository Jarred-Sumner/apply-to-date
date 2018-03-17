class DateEvent < ApplicationRecord
  belongs_to :profile
  belongs_to :user
  has_many :date_event_applications

  REGION_CENTERS = {
    bay_area: [37.625281, -122.239741],
    boston: [42.3145186,-71.1103667],
    new_york: [40.6976637,-74.1197639]
  }.with_indifferent_access

  TIME_ZONES_FOR_REGION = {
    bay_area: 'America/Los_Angeles',
    boston: 'America/New_York',
    new_york: 'America/New_York'
  }.with_indifferent_access

  def self.time_zone(region)
    ActiveSupport::TimeZone.new(TIME_ZONES_FOR_REGION[region])
  end

  def time_zone
    DateEvent.time_zone(region)
  end

  def occurs_on_day
    if attributes['occurs_on_day'].present?
      attributes['occurs_on_day'].in_time_zone(time_zone)
    else
      nil
    end
  end

  def time_of_day
    if starts_at.present?
      if starts_at.hour > 4 && starts_at.hour < 12
        :morning
      elsif starts_at.hour >= 12 && starts_at.hour < 17
        :afternoon
      else
        :evening
      end
    else
      nil
    end
  end

  def can_still_choose_someone_else?
    occurs_on_day >= time_zone.today && !hidden?
  end

  enum category: {
    dine: 0,
    lunch: 1,
    formal: 2,
    movie: 3,
    comedy_show: 4,
    concert: 5,
    coffee: 6,
    fitness: 7,
    custom: -1,
  }

  enum region: {
    bay_area: 0,
    boston: 1,
    new_york: 2
  }

  enum status: {
    scheduled: 0,
    expired: 1,
    hidden: -1,
    chose_applicant: 3
  }

  validates :starts_at_timezone, :presence => true, :if => :starts_at
  validates :ends_at_timezone, :presence => true, :if => :ends_at
  validates :region, presence: true, inclusion: { in: DateEvent.regions.keys }
  validates :status, presence: true, inclusion: { in: DateEvent.statuses.keys }
  validates :category, presence: true, inclusion: { in: DateEvent.categories.keys }

  before_validation on: :create do
    self.starts_at_timezone ||= time_zone
    self.ends_at_timezone ||= time_zone
  end
end
