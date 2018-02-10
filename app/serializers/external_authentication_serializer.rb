class ExternalAuthenticationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :external_authentication

  attributes :username, :provider, :name
end