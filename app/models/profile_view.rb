class ProfileView < ApplicationRecord
  belongs_to :profile
  belongs_to :user
  belongs_to :viewed_by_profile, class_name: 'Profile'
  belongs_to :viewed_by_user, class_name: 'User'

  validates :profile_id, uniqueness: { scope: :viewed_by_profile_id }
  validates :user_id, uniqueness: { scope: :viewed_by_user_id }
  validates :last_viewed_at, presence: true
  validates :view_count, numericality: true, presence: true

  before_validation on: :create do
    self.user = profile.user

    self.viewed_by_profile ||= viewed_by_user.try(:profile)
  end
end
