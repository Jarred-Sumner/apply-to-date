Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'users/me' => 'users#me'
      get 'verifications/:id' => 'external_authentications#show'
      get 'images/sign' => 'images#sign'
      resources :users
      resources :profiles do
        post 'apply' => 'applications#create'
        get 'application' => 'applications#show'
        post 'verify/:provder' => 'applications#external_authentication'
      end
      resources :sessions
      
    end
  end

  get '/auth/:provider/callback' => 'api/v1/external_authentications#create'

  root to: 'application#root'
end
