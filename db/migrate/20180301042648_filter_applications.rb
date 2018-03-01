class FilterApplications < ActiveRecord::Migration[5.1]
  def change
    Profile.find_each do |profile|
      profile.applications.where.not(sex: profile.interested_in_sexes).update_all(status: Application.statuses[:filtered])
    end
  end
end
