class NotificationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :notification

  attributes :kind, :status, :notifiable_id, :meta, :created_at
  belongs_to :user
end