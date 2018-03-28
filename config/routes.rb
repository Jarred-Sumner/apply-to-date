require 'sidekiq/web'
require 'admin_constraint'

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq', :constraints => AdminConstraint.new

  namespace :api do
    namespace :v1 do
      get 'users/me' => 'users#me'
      get 'verifications' => 'external_authentications#index'
      get 'verifications/:id' => 'external_authentications#show'
      post 'verifications/:provider' => 'external_authentications#claim'

      get 'applications/:id' => 'applications#show_applicant'
      put 'applications/:id' => 'applications#update'
      post 'forgot-password' => 'forgot_passwords#create'
      post 'reset-password/:id' => 'reset_passwords#create'

      get '/feeds/:provider' => 'feeds#show'

      get 'images/sign' => 'images#sign'
      resources :users
      post '/profiles/get' => 'profiles#show'
      put '/profiles' => 'profiles#update'
      get '/profiles/photo' => 'profiles#photo'
      post '/profiles/shuffle' => 'profiles#shuffle'
      resources :matchmakes
      post '/matchmakes/new' => 'matchmakes#new'
      resources :profiles do
        post 'apply' => 'applications#create'
      end
      match 'profiles/(:id)' => 'profiles#show', :constraints => {:id => /[^\/]+/}, via: :get, :format => false
      match 'profiles/(:id)' => 'profiles#update', :constraints => {:id => /[^\/]+/}, via: :put, :format => false
      match 'profiles/(:profile_id)/apply' => 'applications#create', :constraints => {:profile_id => /[^\/]+/}, via: :post, :format => false

      resources :sessions
      delete 'sessions' => 'sessions#destroy'
      post '/notifications/read_all' => 'notifications#read_all'

      resources :ratings
      resources :notifications, only: [:index, :update]
      post '/date_events/slug' => 'date_events#show_slug'
      resources :date_events do
        post '/rate/:date_event_application_id' => 'date_events#rate'
        get '/applications' => 'date_event_applications#index_event'
      end
      resources :date_event_applications
      post '/devices' => 'devices#update'

      post '/profile/application' => 'applications#for_profile'

      post '/reports/:reportable_type/:reportable_id' => 'reports#create'
      get '/reports/:reportable_type/:reportable_id' => 'reports#show'

      post '/blocks' => 'blocks#create'
      get '/blocks/:profile_id' => 'blocks#show'

      get '/apply-mobile-cookie' => 'application#apply_mobile_cookie'
      post '/zzz' => 'profile_views#create'
    end
  end

  get '/wow/so/email' => 'application#login_as', :constraints => AdminConstraint.new
  get '/auth/:provider/callback' => 'api/v1/external_authentications#create'

  root to: 'application#root'
end
