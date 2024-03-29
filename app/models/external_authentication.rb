class ExternalAuthentication < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :application, optional: true
  has_many :verified_networks
  has_many :applications, through: :verified_networks

  scope :facebook, lambda { where(provider: 'facebook') }
  scope :with_photos, lambda { where(provider: PROVIDERS_WITH_PHOTOS) }

  FACEBOOK_NAME_REGEX = /^[a-z0-9\\.-]{5,50}$/

  def self.facebook_oauth
    @@facebook_oauth ||= Koala::Facebook::OAuth.new( Rails.application.secrets[:facebook_key], Rails.application.secrets[:facebook_secret])
  end

  def self.initialize_from_twitter_credentials(access_token: nil, access_token_secret: nil)
    external_authentication = ExternalAuthentication.new(access_token: access_token, access_token_secret: access_token_secret, provider: 'twitter')

    external_authentication.update!(ExternalAuthentication.build_from_twitter_user(external_authentication.twitter.user))

    external_authentication
  end

  PROVIDERS_WITH_PHOTOS = [
    'facebook',
    'twitter',
  ]

  def self.build_default_photo_url(external_authentications)
    if facebook = external_authentications.find_by(provider: 'facebook')
      facebook.build_facebook_photo_url
    elsif twitter = external_authentications.find_by(provider: 'twitter')
      twitter.build_twitter_photo_url
    end
  end

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

  def self.initialize_from_facebook_credentials(credentials)
    props = {
      provider: 'facebook',
      access_token: credentials['access_token'],
      access_token_expiration: credentials['expires_in'].seconds.from_now.to_datetime
    }

    profile, photos = ExternalAuthentication.get_facebook_details(credentials['access_token'])

    props = props.merge(
      ExternalAuthentication.build_from_facebook_profile(profile)
    )

    ExternalAuthentication.new(props)
  end

  def self.facebook_graph_api(token)
    Koala::Facebook::API.new(token, Rails.application.secrets[:facebook_secret])
  end

  def facebook_graph_api
    ExternalAuthentication.facebook_graph_api(access_token)
  end

  def get_facebook_photos(limit = 3)
    begin
      image_sets = facebook_graph_api.get_connections("me", "photos", type: 'tagged', fields: 'images', limit: limit)
      image_sets.map do |data|
        data['images'].first['source']
      end
    rescue => e
      Raven.capture_exception(e)
      Rails.logger.info e
      Rails.logger.info "GETTING FACEBOOK PHOTOS FAILED FOR EXTERNAL AUTHENTICATION #{id}"
      return []
    end
  end

  def self.get_facebook_details(token)
    graph = facebook_graph_api(token)

    graph.batch do |batch_api|
      batch_api.get_object('me', {:fields => [:name, :email, :id, :location, :gender, :birthday]})
    end
  end

  def twitter
    if access_token_secret.present?
      @twitter ||= Twitter::REST::Client.new do |config|
        config.consumer_key        = Rails.application.secrets[:twitter_key]
        config.consumer_secret     = Rails.application.secrets[:twitter_secret]
        config.access_token        = access_token
        config.access_token_secret = access_token_secret
      end
    else
      @twitter ||= Twitter::REST::Client.new do |config|
        config.consumer_key        = Rails.application.secrets[:twitter_key]
        config.consumer_secret     = Rails.application.secrets[:twitter_secret]
        config.access_token        = Rails.application.secrets[:jarred_twitter_key]
        config.access_token_secret = Rails.application.secrets[:jarred_twitter_secret]
      end
    end
  end

  def instagram
    @instagram ||= begin
      return nil if access_token.blank? || provider != 'instagram'

      Instagram.new(access_token)
    end
  end

  def build_facebook_photo_url
    return nil if provider != 'facebook'

    "https://graph.facebook.com/#{uid}/picture?width=2048&height=2048&access_token=#{access_token}"
  end

  def build_twitter_photo_url
    return nil if provider != 'twitter'
    return nil if info['image'].blank?

    info['image'].gsub('_normal', '')
  end

  def get_facebook_details
    return nil if provider != 'facebook'

    ExternalAuthentication.get_facebook_details(access_token)
  end

  def self.build_from_facebook_profile(profile)
    {
      uid: profile["id"],
      name: profile["short_name"] || profile["name"],
      email: profile["email"],
      location: profile["location"].present? ? profile["location"]["name"] : nil,
      sex: profile["gender"],
      birthday: profile["birthday"].present? ? Date.strptime(profile["birthday"], "%m/%d/%Y") : nil,
    }
  end

  def self.build_from_twitter_user(user)
    {
      uid: user.id,
      name: user.name,
      email: user.email,
      username: user.screen_name,
      location: user.location,
      raw_info: user.to_h,
      info: {
        :nickname => user.screen_name,
        :name => user.name,
        :email => user.email,
        :location => user.location,
        :description => user.description,
        :urls => {
          'Website' => user.url.to_s,
          'Twitter' => "https://twitter.com/#{user.screen_name}",
        }
      }
    }
  end

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

    if url.blank? || provider == 'phone'
      return nil
    end

    if provider == 'twitter'
      if url.include? "twitter.com/"
        username = url.split("twitter.com/").last
        username = "@#{username}" if !username.starts_with?("@") && username.present?

        return ExternalAuthentication.normalize_social_link(username, provider)
      elsif url.starts_with? "@"
        return "https://twitter.com/#{url}"
      else
        return nil
      end
    elsif provider == 'medium'
      if url.include? "medium.com/"
        username = url.split("medium.com/").last
        username = "@#{username}" if !username.starts_with?("@") && username.present?

        return ExternalAuthentication.normalize_social_link(username, provider)
      elsif url.starts_with? "@"
        return "https://medium.com/#{url}"
      elsif url.present?
        return "https://medium.com/@#{url}"
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
        username = url.split("instagram.com/").last

        return ExternalAuthentication.normalize_social_link(username, provider)
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
    elsif provider == 'snapchat'
      if url.include? "snapchat.com/add/"
        return ExternalAuthentication.normalize_social_link(url.split("snapchat.com/add/").last, provider)
      else
        return "https://www.snapchat.com/add/#{url}"
      end
    else
      return url
    end
  end

  def get_user
    @get_user ||= user || verified_networks.where.not(profile_id: nil).first.try(:profile).try(:user)
  end

  def self.update_from_omniauth(auth_hash)
    auth = ExternalAuthentication.where(
      uid: auth_hash.uid,
      provider: auth_hash.provider
    ).first_or_initialize

    auth.name = auth_hash.info.name
    auth.access_token = auth_hash.credentials.token
    auth.access_token_secret = auth_hash.credentials.secret

    auth.access_token_expiration = Time.at(auth_hash.credentials.expires_at).to_datetime if auth_hash.credentials.expires

    auth.email = auth_hash.info.email if auth_hash.info.email.present?
    auth.username = auth_hash.info.nickname if auth_hash.info.nickname.present?

    auth.location = auth_hash.info.location if auth_hash.info.location.present?
    auth.sex = auth_hash.extra.raw_info.gender if ['male','female'].include?(auth_hash.extra.raw_info.gender)

    begin
      auth.birthday = Date.strptime(auth_hash.extra.raw_info.birthday, "%m/%d/%Y") if auth_hash.extra.raw_info.birthday.present?
    rescue => e
      Sentry.capture_exception(e)
    end

    auth.info = auth_hash.info.as_json
    auth.raw_info = auth_hash.raw_info.as_json

    auth.save!

    auth
  end

  def url
    build_social_link_entry[provider]
  end

  def build_social_link_entry
    social_links = {}

    if provider == 'twitter'
      social_links[provider] = "https://twitter.com/#{username}"
    elsif provider == 'facebook'
      social_links[provider] = "https://www.facebook.com/app_scoped_user_id/#{uid}"
    elsif provider == 'instagram'
      social_links[provider] = "https://instagram.com/#{username}"
    elsif provider == 'linkedin'
      social_links[provider] = info.try(:[], "urls").try(:[], "public_profile")
    elsif provider == 'medium'
      social_links[provider] = "https://instagram.com/@#{username}"
    end

    social_links.with_indifferent_access
  end
end
