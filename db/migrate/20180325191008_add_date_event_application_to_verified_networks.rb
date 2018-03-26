class AddDateEventApplicationToVerifiedNetworks < ActiveRecord::Migration[5.1]
  def change
    add_reference :verified_networks, :date_event_application, foreign_key: true, index: true
  end
end
