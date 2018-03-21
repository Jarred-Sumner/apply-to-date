class ExternalAuthenticationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :external_authentication

  attributes :username, :provider, :name, :email, :sex, :birthday, :location, :url
end