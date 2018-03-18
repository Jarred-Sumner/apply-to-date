class DateEventApplicationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :date_event_application

  has_one :profile, class_name: 'Profile'
  has_one :date_event, class_name: 'DateEvent'

  attributes :social_links, :sections, :name, :photos, :email, :name, :profile_id, :date_event_id, :sex, :recommended_contact_method, :approval_status, :approved, :confirmation_status, :date_event_phone
end