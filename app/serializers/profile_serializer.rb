class ProfileSerializer
  include FastJsonapi::ObjectSerializer
  set_type :profile

  attributes :sections, :social_links, :user_id, :name, :photos, :tagline, :featured, :recommended_contact_methods
end