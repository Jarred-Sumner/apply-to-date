class NotificationSerializer 
  include FastJsonapi::ObjectSerializer
  set_type :notification

  attributes :kind, :status, :notifiable_id, :meta
  belongs_to :user
end