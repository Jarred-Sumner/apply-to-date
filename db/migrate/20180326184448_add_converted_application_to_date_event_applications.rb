class AddConvertedApplicationToDateEventApplications < ActiveRecord::Migration[5.1]
  def change
    add_reference :date_event_applications, :converted_application, foreign_key: {to_table: :applications}, index: true, type: :uuid
  end
end
