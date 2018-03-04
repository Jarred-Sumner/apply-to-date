class Report < ApplicationRecord
  belongs_to :user
  belongs_to :reportable, polymorphic: true

  VALID_REPORTABLE_TYPES = [
    'profile'
  ]
end
