class ProfilePostSerializer
  include FastJsonapi::ObjectSerializer
  set_type :profile_post

  attributes :body, :visible, :author_name, :author_photo
end