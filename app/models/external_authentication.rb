class ExternalAuthentication < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :application, optional: true

  FACEBOOK_NAME_REGEX = /^[a-z0-9\\.-]{5,50}$/

  ALLOWED_SOCIAL_LINKS = [
    'twitter',
    'medium',
    'facebook',
    'instagram',
    'youtube',
    'dribbble',
    'linkedin',
    'snapchat'
  ]

  def self.update_social_links(social_links = {})
    ExternalAuthentication::ALLOWED_SOCIAL_LINKS.map do |key| 
      [
        key, 
        ExternalAuthentication.normalize_social_link(
          social_links[key],
          key
        )
      ]
    end.to_h
  end

  def self.normalize_social_link(url, provider)
    url = url.try(:strip)

    if url.blank?
      return nil
    end

    if provider == 'twitter'
      p url
      if url.include? "twitter.com/"
        return ExternalAuthentication.normalize_social_link(url.split("twitter.com/").last, provider)
      elsif url.starts_with? "@"
        return "https://twitter.com/#{url}"
      else
        return nil
      end
    elsif provider == 'medium'
      if url.include? "medium.com/"
        return ExternalAuthentication.normalize_social_link(url.split("medium.com/").last, provider)
      elsif url.starts_with? "@"
        return "https://medium.com/#{url}"
      else
        return nil
      end
    elsif provider == 'facebook'
      if url.include? "facebook.com/pages/"
        return ExternalAuthentication.normalize_social_link(url.split("facebook.com/pages/").last, provider)
      elsif url.include? "facebook.com/"
        return ExternalAuthentication.normalize_social_link(url.split("facebook.com/").last, provider)
      else
        return "https://facebook.com/#{url}"
      end
    elsif provider == 'instagram'
      if url.include? "instagram.com/"
        return ExternalAuthentication.normalize_social_link(url.split("instagram.com/").last, provider)
      else
        return "https://www.instagram.com/#{url}"
      end
    elsif provider == 'youtube'
      if url.include? "youtube.com/"
        return ExternalAuthentication.normalize_social_link(url.split("youtube.com/").last, provider)
      else
        return "https://youtube.com/#{url}"
      end
    elsif provider == 'dribbble'
      if url.include? "dribbble.com/"
        return ExternalAuthentication.normalize_social_link(url.split("dribbble.com/").last, provider)
      else
        return "https://dribbble.com/#{url}"
      end
    else
      return url
    end
  end

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

    if provider == 'twitter'
      social_links[provider] = info['urls']['Twitter']
    elsif provider == 'facebook'
      social_links[provider] = "https://www.facebook.com/app_scoped_user_id/#{uid}?access_token=#{access_token}"
    end

    social_links
  end
end
