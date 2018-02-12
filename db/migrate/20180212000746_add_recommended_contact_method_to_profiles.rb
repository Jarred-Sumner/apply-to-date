class AddRecommendedContactMethodToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :recommended_contact_method, :string
  end
end
