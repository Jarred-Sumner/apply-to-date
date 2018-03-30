require_relative 'boot'

require 'rails/all'
# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Dateme
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    config.autoload_paths << "#{Rails.root}/lib"
    config.autoload_paths << "#{Rails.root}/app/notifications"
    config.autoload_paths << "#{Rails.root}/app/serializers"
    config.read_encrypted_secrets = true

    config.action_dispatch.default_headers.merge!(
      'Cache-Control' => 'no-store, no-cache'
    )

    config.action_mailer.delivery_method = :mailgun
    config.action_mailer.mailgun_settings = {
        api_key: Rails.application.secrets[:mailgun],
        domain: 'mail.applytodate.com'
    }

    config.active_job.queue_adapter = :sidekiq
    config.cache_store = :redis_store, "#{Rails.application.secrets[:redis_url]}/0/cache"

    Geokit::Geocoders::GoogleGeocoder.api_key = Rails.application.secrets[:google_maps_key]
    OneSignal::OneSignal.api_key = Rails.application.secrets[:onesignal_key]

    config.session_store(
      :cookie_store,
      key: '_dateme_session',
      expire_after: 2.years
    )

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
