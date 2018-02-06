class UserSerializer
  include FastJsonapi::ObjectSerializer
  set_type :user

  attributes :username, :email
  has_one :profile
end