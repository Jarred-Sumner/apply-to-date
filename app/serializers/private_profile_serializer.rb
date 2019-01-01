class PrivateProfileSerializer
  include FastJsonapi::ObjectSerializer
  set_type :profile
  has_many :external_authentications

  attributes :sections, :social_links, :user_id, :name, :photos, :tagline, :featured, :phone, :recommended_contact_method, :url, :visible, :location, :appear_in_discover, :appear_in_matchmake, :region
  has_many :profile_posts
end