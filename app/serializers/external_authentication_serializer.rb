class ExternalAuthenticationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :external_authentication

  attributes :username, :email, :provider, :name, :location, :photos
end