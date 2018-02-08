Aws.config.update({
  access_key_id: Rails.application.secrets[:spaces_key],
  secret_access_key: Rails.application.secrets[:spaces_secret],
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'ny3'
})
