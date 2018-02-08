class ApplicantApplicationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :application

  attributes :social_links, :sections, :name, :photos, :email, :name
end