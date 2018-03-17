class AddApplicantProfileToApplications < ActiveRecord::Migration[5.1]
  def change
    add_reference :applications, :applicant_profile, foreign_key: {to_table: :profiles}, type: :citext, index: true
    Application.includes(:user => :profile).where.not(applicant_id: nil).find_each do |application|
      application.applicant_profile = application.applicant.profile
      application.save!(touch: false)
    end
  end
end
