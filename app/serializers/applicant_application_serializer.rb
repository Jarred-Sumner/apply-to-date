class ApplicantApplicationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :application

  has_many :external_authentications
  attributes :social_links, :sections, :name, :photos, :email, :name
end