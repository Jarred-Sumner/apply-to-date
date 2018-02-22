Rails.application.routes.draw do
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

      get 'images/sign' => 'images#sign'
      resources :users
      resources :profiles do
        post 'apply' => 'applications#create'
      end
      match 'profiles/(:id)' => 'profiles#show', :constraints => {:id => /[^\/]+/}, via: :get, :format => false
      match 'profiles/(:id)' => 'profiles#update', :constraints => {:id => /[^\/]+/}, via: :put, :format => false
      match 'profiles/(:profile_id)/apply' => 'applications#create', :constraints => {:profile_id => /[^\/]+/}, via: :post, :format => false
      resources :sessions

      resources :ratings
    end
  end

  get '/auth/:provider/callback' => 'api/v1/external_authentications#create'

  root to: 'application#root'
end
