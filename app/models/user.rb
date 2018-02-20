class User < ApplicationRecord
  BLACKLISTED_USERNAMES = File.readlines("#{Rails.root}/config/blacklisted-usernames.txt").map(&:strip)
  authenticates_with_sorcery!
  has_one :profile
  has_many :external_authentications, through: :profile

  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }

  validates :email, uniqueness: true, presence: true, format: /\A([^@\s]+)@((?:[-a-z0-9l]+\.)+[a-z]{2,})\Z/i
  validates :username, uniqueness: true, presence: true, format: { with: /[a-zA-Z0-9\-\_\.]*/ }
  validates :sex, presence: true, inclusion: { in: ['male', 'female', 'other']}

  def self.blacklisted_username?(username)
    BLACKLISTED_USERNAMES.include?(username)
  end
end
