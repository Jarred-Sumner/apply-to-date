class AddGenderAndBirthdayToExternalAuthentications < ActiveRecord::Migration[5.1]
  def change
    add_column :external_authentications, :sex, :string
    add_column :external_authentications, :birthday, :date
  end
end
