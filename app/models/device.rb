class Device < ApplicationRecord
  belongs_to :user
  scope :push_enabled, lambda { where(push_enabled: true) }

  HEADER_KEYS = {
    platform: "HTTP_X_PLATFORM_OS",
    platform_version: "HTTP_X_PLATFORM_VERSION",
    timezone: "HTTP_X_DEVICE_TIMEZONE",
    uid: "HTTP_X_DEVICE_ID",
    app_version: "HTTP_X_APP_VERSION"
  }.with_indifferent_access

  def self.normalize_from_headers(request_headers)
    HEADER_KEYS.map do |key, value|
      [key, request_headers[value]]
    end.to_h.with_indifferent_access
  end

  def self.update_from_headers(request_headers, user)
    if user.present? && request_headers[HEADER_KEYS[:uid]].present?
      device_info = Device.normalize_from_headers(request_headers)
      device = Device.where(
        uid: device_info[:uid]
      ).first_or_initialize

      device.user = user

      device.update(device_info.merge(last_seen_at: DateTime.now))

      device
    end
  end

  validates :uid, presence: true, uniqueness: true
end
