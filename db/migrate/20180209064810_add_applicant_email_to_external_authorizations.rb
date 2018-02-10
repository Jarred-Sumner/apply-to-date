class AddApplicantEmailToExternalAuthorizations < ActiveRecord::Migration[5.1]
  def change
    add_column :external_authentications, :applicant_email, :string
  end
end
