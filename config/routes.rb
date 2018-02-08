Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'users/me' => 'users#me'
      get 'verifications/:id' => 'external_authentications#show'
      get 'images/sign' => 'images#sign'
      resources :users
      resources :profiles
      resources :sessions
    end
  end

  get '/auth/:provider/callback' => 'api/v1/external_authentications#create'

  root to: 'application#root'
end
