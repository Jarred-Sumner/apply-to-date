class ProfileSerializer
  include FastJsonapi::ObjectSerializer
  set_type :profile

  attributes :sections, :social_links, :user_id, :name, :photos, :tagline, :tags, :recommended_contact_method, :featured
end