class UserSerializer
  include FastJsonapi::ObjectSerializer
  set_type :user

  attributes :username, :email, :is_auto_apply_enabled, :created_at, :sex, :interested_in_men, :interested_in_women, :interested_in_other
  has_one :profile, serializer: 'PrivateProfile'
  has_many :external_authentications
end