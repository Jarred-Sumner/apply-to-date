class User < ApplicationRecord
  BLACKLISTED_USERNAMES = File.readlines("#{Rails.root}/config/blacklisted-usernames.txt").map(&:strip)
  PROBABLY_FAKE_ACCOUNTS = ['test', 'poop', 'jarred', 'jane', 'lucy', 'example', 'fake', "+"]
  VALID_SEXES = ['male', 'female', 'other']
  enum shuffle_status:  [:shuffle_allowed, :shuffle_cooldown]
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
  SHUFFLE_BATCH_SIZE_CEILING = 10.freeze
  SHUFFLE_BATCH_SIZE_FLOOR = 5.freeze
  SHUFFLE_COOLDOWN_CEILING = 24.hours.freeze
  SHUFFLE_COOLDOWN_FLOOR = 1.hours.freeze

  def self.blacklisted_username?(username)
    BLACKLISTED_USERNAMES.include?(username)
  end

  def should_reset_shuffle_session?
    if (self.shuffle_disabled_until.present? && self.shuffle_disabled_until.past?) || last_shuffled_at.nil?
      return true
    elsif SHUFFLE_COOLDOWN_CEILING.ago > self.last_shuffled_at
      return true
    else
      return false
    end
  end

  def end_shuffle_session!
    update(
      shuffle_status: User.shuffle_statuses[:shuffle_cooldown],
      shuffle_disabled_until: (SHUFFLE_COOLDOWN_FLOOR..SHUFFLE_COOLDOWN_CEILING).to_a.sample.seconds.from_now
    )
  end

  def clear_shuffle_session!
    self.update(
      shuffle_disabled_until: nil,
      last_shuffled_at: nil,
      shuffled_session_count: 0,
      shuffle_status: User.shuffle_statuses[:shuffle_allowed]
    )
  end

  def increment_shuffle_session!
    if should_reset_shuffle_session?
      clear_shuffle_session!
      self.update(
        last_shuffled_at: DateTime.now,
        shuffled_session_count: 1,
      )
    elsif shuffle_cooldown?
      return
    else
      if shuffled_session_count >= SHUFFLE_BATCH_SIZE_FLOOR && shuffled_session_count < SHUFFLE_BATCH_SIZE_CEILING
        if [0,1,2,3].to_a.sample == 1
          end_shuffle_session!
          return
        end
      elsif shuffled_session_count >= SHUFFLE_BATCH_SIZE_CEILING
        end_shuffle_session!
        return
      end

      self.update(
        last_shuffled_at: DateTime.now,
        shuffled_session_count: shuffled_session_count + 1,
        shuffle_status: User.shuffle_statuses[:shuffle_allowed]
      )
    end
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
