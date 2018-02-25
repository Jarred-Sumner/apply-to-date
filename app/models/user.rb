class User < ApplicationRecord
  BLACKLISTED_USERNAMES = File.readlines("#{Rails.root}/config/blacklisted-usernames.txt").map(&:strip)
  PROBABLY_FAKE_ACCOUNTS = ['test', 'poop', 'jarred', 'jane', 'lucy', 'example', 'fake', "+"]
  VALID_SEXES = ['male', 'female', 'other']
  authenticates_with_sorcery!
  has_one :profile
  has_many :external_authentications, through: :profile
  has_many :sent_applications, class_name: Application, foreign_key: 'applicant_id'
  has_many :received_applications, class_name: Application

  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }

  validates :email, uniqueness: true, presence: true, format: /\A([^@\s]+)@((?:[-a-z0-9l]+\.)+[a-z]{2,})\Z/i
  validates :username, uniqueness: true, presence: true, format: { with: /[a-zA-Z0-9\-\_\.]*/ }
  validates :sex, presence: true, inclusion: { in: VALID_SEXES }

  def self.blacklisted_username?(username)
    BLACKLISTED_USERNAMES.include?(username)
  end

  def self.interested_in_column_name(sex, table_name = "users")
    {
      male: "#{table_name}.interested_in_men",
      female: "#{table_name}.interested_in_women",
      other: "#{table_name}.interested_in_other"
    }.with_indifferent_access[sex]
  end

  def can_auto_apply?
    profile.name.present? && sex.present? && profile.all_social_networks.values.present?
  end

  def self.real_accounts
    fake_emails = PROBABLY_FAKE_ACCOUNTS.map { |email| "%#{email}%"}
    User.where.not("email ~~ ANY('{#{fake_emails.join(",")}}')")
  end

  def interested_in_sexes
    VALID_SEXES
      .reject { |sex| sex === 'male' && !interested_in_men? }
      .reject { |sex| sex === 'female' && !interested_in_women? }
      .reject { |sex| sex === 'other' && !interested_in_other? }
  end

  alias_method :is_auto_apply_enabled, :can_auto_apply?
end
