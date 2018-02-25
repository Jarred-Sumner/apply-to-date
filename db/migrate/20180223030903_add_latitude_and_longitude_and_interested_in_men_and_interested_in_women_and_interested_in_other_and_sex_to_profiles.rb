class AddLatitudeAndLongitudeAndInterestedInMenAndInterestedInWomenAndInterestedInOtherAndSexToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :interested_in_men, :boolean
    add_column :profiles, :interested_in_women, :boolean
    add_column :profiles, :interested_in_other, :boolean
    add_column :profiles, :sex, :string

    add_index :profiles, [:latitude, :longitude]
    add_index :profiles, :interested_in_men
    add_index :profiles, :interested_in_women
    add_index :profiles, :interested_in_other
    add_index :profiles, :sex

    Profile.includes(:user).find_each do |profile|
      profile.update(
        interested_in_men: profile.user.interested_in_men,
        interested_in_other: profile.user.interested_in_other,
        interested_in_women: profile.user.interested_in_women,
        sex: profile.user.sex
      )
    end
  end
end
