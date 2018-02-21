class UserSerializer
  include FastJsonapi::ObjectSerializer
  set_type :user

  attributes :username, :email, :is_auto_apply_enabled
  has_one :profile, serializer: 'PrivateProfile'
  has_many :external_authentications
end