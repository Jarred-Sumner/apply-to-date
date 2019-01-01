class ProfilePost < ApplicationRecord
  belongs_to :author, optional: true
  belongs_to :profile

  before_validation on: :create do
    self.author_token = SecureRandom.urlsafe_base64(12)
  end

  scope :visible, lambda { where(visible: true) }
end
