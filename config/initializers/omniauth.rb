Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, Rails.application.secrets[:google_client_id], Rails.application.secrets[:google_secret], scope: 'email,profile,https://www.googleapis.com/auth/youtube.readonly'
  provider :facebook, Rails.application.secrets[:facebook_key], Rails.application.secrets[:facebook_secret], scope: 'email,public_profile', info_fields: 'name,email,gender,interested_in,location,short_name,is_verified,timezone,birthday,age_range,photos'
  provider :instagram, Rails.application.secrets[:instagram_client_id], Rails.application.secrets[:instagram_secret], scope: 'basic'
  provider :twitter, Rails.application.secrets[:twitter_key], Rails.application.secrets[:twitter_secret]
end