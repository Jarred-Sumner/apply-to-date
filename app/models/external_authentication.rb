class ExternalAuthentication < ApplicationRecord
  belongs_to :user, optional: true
end
