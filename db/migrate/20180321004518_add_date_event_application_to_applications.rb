class AddDateEventApplicationToApplications < ActiveRecord::Migration[5.1]
  def change
    add_reference :applications, :date_event_application, foreign_key: true
  end
end
