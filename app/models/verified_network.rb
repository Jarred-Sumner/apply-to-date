class VerifiedNetwork < ApplicationRecord
  belongs_to :external_authentication
  belongs_to :profile, optional: true
  belongs_to :application, optional: true

  
end
