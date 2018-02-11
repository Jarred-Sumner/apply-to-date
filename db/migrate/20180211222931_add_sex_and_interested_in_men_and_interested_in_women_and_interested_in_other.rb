class AddSexAndInterestedInMenAndInterestedInWomenAndInterestedInOther < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :sex, :string
    add_column :users, :interested_in_men, :boolean
    add_column :users, :interested_in_women, :boolean
    add_column :users, :interested_in_other, :boolean
  end
end
