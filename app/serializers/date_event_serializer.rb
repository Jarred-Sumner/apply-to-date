class DateEventSerializer
  include FastJsonapi::ObjectSerializer
  set_type :date_event

  attributes :occurs_on_day, :region, :summary, :location, :category, :title, :status, :time_of_day
  has_one :profile, class_name: 'Profile'
end