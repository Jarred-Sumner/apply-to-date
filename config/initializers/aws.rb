if Rails.application.secrets[:upload_host] == 's3'
  Aws.config.update({
    access_key_id: Rails.application.secrets[:s3_key],
    secret_access_key: Rails.application.secrets[:s3_secret],
    endpoint: 'https://s3-us-west-1.amazonaws.com/',
    region: 'us-west-1'
  })
else
  Aws.config.update({
    access_key_id: Rails.application.secrets[:spaces_key],
    secret_access_key: Rails.application.secrets[:spaces_secret],
    endpoint: 'https://nyc3.digitaloceanspaces.com',
    region: 'ny3'
  })
end
