class AddBirthdayToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :birthday, :date

    Profile.includes(:external_authentications).find_each do |profile|
      facebook = profile.external_authentications.facebook.order("created_at DESC").first
      if facebook.present?
        begin
          fb_user = facebook.facebook_graph_api.get_object("me", fields: ['birthday'])

          if fb_user['birthday'].present?
            begin
              profile.update!(
                birthday: Date.parse(fb_user["birthday"])
              )
            rescue => e
              p fb_user
            end
          end
        rescue => e
        end
      end
    end
  end
end
