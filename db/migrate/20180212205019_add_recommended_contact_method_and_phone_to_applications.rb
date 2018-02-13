class AddRecommendedContactMethodAndPhoneToApplications < ActiveRecord::Migration[5.1]
  def change
    add_column :applications, :recommended_contact_method, :string
    add_column :applications, :phone, :string
  end
end
