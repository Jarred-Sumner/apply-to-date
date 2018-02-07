class ExternalAuthentication < ApplicationRecord
  belongs_to :user, optional: true

  def self.update_from_omniauth(auth_hash)
    auth = ExternalAuthentication.where(
      uid: auth_hash.uid,
      provider: auth_hash.provider
    ).first_or_initialize

    auth.name = auth_hash.info.name
    auth.access_token = auth_hash.credentials.token

    auth.access_token_expiration = Time.at(auth_hash.credentials.expires_at).to_datetime if auth_hash.credentials.expires

    auth.email = auth_hash.info.email if auth_hash.info.email.present?
    auth.username = auth_hash.info.nickname if auth_hash.info.nickname.present?
    auth.location = auth_hash.info.location if auth_hash.info.location.present?

    auth.info = auth_hash.info.as_json
    auth.raw_info = auth_hash.raw_info.as_json

    auth.save!

    auth
  end

  def build_social_link_entry
    social_links = {}

    if provider === 'twitter'
      social_links[provider] = info['urls']['Twitter']
    end

    social_links
  end
end
