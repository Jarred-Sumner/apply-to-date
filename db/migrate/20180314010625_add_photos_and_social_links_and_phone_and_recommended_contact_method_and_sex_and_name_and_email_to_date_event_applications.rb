class AddPhotosAndSocialLinksAndPhoneAndRecommendedContactMethodAndSexAndNameAndEmailToDateEventApplications < ActiveRecord::Migration[5.1]
  def change
    change_table :date_event_applications do |t|
      t.string "sex"
      t.string "recommended_contact_method"
    end

    add_index :date_event_applications, :email
  end
end
