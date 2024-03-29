class ProfileSerializer
  include FastJsonapi::ObjectSerializer
  set_type :profile

  attributes :sections, :social_links, :user_id, :name, :photos, :tagline, :tags, :sex, :recommended_contact_method, :featured, :url, :visible, :location, :region

  def url
    Rails.application.secrets[:frontend_url] + "#{@id}"
  end
end