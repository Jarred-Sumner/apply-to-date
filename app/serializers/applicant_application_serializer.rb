class ApplicantApplicationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :application

  has_many :external_authentications
  belongs_to :profile
  attributes :social_links, :sections, :name, :photos, :email, :name, :profile_id, :sex, :recommended_contact_method
end