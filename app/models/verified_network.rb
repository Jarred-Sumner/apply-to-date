class VerifiedNetwork < ApplicationRecord
  belongs_to :external_authentication
  belongs_to :profile, optional: true
  belongs_to :application, optional: true
  belongs_to :date_event_application, optional: true
end
