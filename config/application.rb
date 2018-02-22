require_relative 'boot'

require 'rails/all'
# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

Raven.configure do |config|
  config.dsn = 'https://dd8ddf4b32804512929fcf088e0413b8:a4ddb0034719405eb5bf7f846cbbb1dc@sentry.io/287972'
end

module Dateme
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    config.autoload_paths << "#{Rails.root}/lib"
    config.autoload_paths << "#{Rails.root}/app/serializers"
    config.read_encrypted_secrets = true
    
    config.action_mailer.delivery_method = :mailgun
    config.action_mailer.mailgun_settings = {
        api_key: Rails.application.secrets[:mailgun],
        domain: 'mail.applytodate.com'
    }


    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'localhost:3000', '127.0.0.1:3000', "applytodate.me", "applytodate.com"
        resource '*', :headers => [

        ], :methods => [:get, :post, :put, :options], :credentials => true
      end
    end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.eager_load_paths << Rails.root.join('lib')

  end
end
