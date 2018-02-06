Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'users/me' => 'users#me'
      resources :users
      resources :profiles
      resources :sessions
    end
  end

  root to: 'application#root'
end
