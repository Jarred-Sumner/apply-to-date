class ReviewApplicationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :review_application

  attributes :social_links, :sections, :name, :photos, :name, :sex, :recommended_contact_method, :status, :created_at
end