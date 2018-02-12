class PrivateProfileSerializer
  include FastJsonapi::ObjectSerializer
  set_type :profile
  has_many :external_authentications

  attributes :sections, :social_links, :user_id, :name, :photos, :tagline, :featured, :phone, :recommended_contact_method

end