class NotificationSerializer
  include FastJsonapi::ObjectSerializer
  set_type :notification

  attributes :kind, :status, :notifiable_id, :notifiable_type, :meta, :occurred_at
  belongs_to :user
end