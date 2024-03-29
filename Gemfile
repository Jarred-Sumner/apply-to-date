source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.4'
# Use Puma as the app server
gem 'puma', '~> 3.7'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'pg', '~> 0.18'
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
gem 'geokit-rails'
gem 'therubyracer', platforms: :ruby
gem 'mailgun_rails'
gem 'omniauth-linkedin-oauth2'
gem 'omniauth-medium', github: 'hugodias/omniauth-medium'
gem "possessive"
gem 'newrelic_rpm'
gem 'sidekiq'

gem 'one_signal'

gem 'twitter', require: 'twitter'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
gem 'addressable', require: 'addressable/uri'
gem 'capistrano3-unicorn'#, require: 'capistrano3/unicorn'
gem 'capistrano-rvm'
gem 'aws-sdk', '~> 2'
gem 'sorcery'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
gem 'fast_jsonapi'
gem 'rack-cors', :require => 'rack/cors'
gem 'premailer-rails'
gem "letter_opener", :group => :development
# Use Capistrano for deployment
gem 'capistrano-rails', group: :development
gem 'faraday-manual-cache'
gem "sentry-raven"
gem 'capistrano-rails-logs-tail'
gem 'capistrano-passenger'

gem 'phonelib'

gem 'unicorn'

gem 'pry-rails'
gem 'pry-coolline'
gem 'friendly_id', '~> 5.1.0' # Note: You MUST use 5.0.0 or greater for Rails 4.0+
gem 'pry-awesome_print'
gem 'omniauth'
gem 'omniauth-twitter'
gem 'omniauth-instagram'
gem 'omniauth-facebook'
gem 'omniauth-google-oauth2'
gem "capistrano", "~> 3.10"
  gem 'capistrano-passenger'
  gem 'capistrano-rails-console', require: false

gem 'koala'
gem 'redis-rails'

gem 'capistrano-sidekiq'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'


end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
