class ProfileSerializer
  include FastJsonapi::ObjectSerializer
  set_type :profile

  attributes :sections, :social_links, :user_id, :name, :photos, :tagline, :tags, :sex, :recommended_contact_method, :featured, :url, :visible, :location, :region
  has_many :profile_posts, object_method_name: :visible_profile_posts

  def url
    Rails.application.secrets[:frontend_url] + "#{@id}"
  end
end