class ReviewApplicationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :review_application

  has_one :applicant_profile, class_name: 'Profile', record_type: 'profile'
  has_many :external_authentications
  attributes :social_links, :sections, :name, :photos, :name, :sex, :recommended_contact_method, :status, :created_at, :phone
end