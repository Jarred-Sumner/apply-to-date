class Matchmake < ApplicationRecord
  belongs_to :left_profile, class_name: Profile
  belongs_to :right_profile, class_name: Profile
  MINIMUM_AVERAGE_RATING = 4.0.freeze
  MINIMUM_NUMBER_OF_VOTES = 5.freeze

  scope :has_enough_ratings, lambda { where("matchmake_ratings_count >= ?", MINIMUM_NUMBER_OF_VOTES) }
  scope :quality_match, lambda { where("rating >= ?", MINIMUM_AVERAGE_RATING) }
  scope :qualifying, lambda { pending.quality_match.has_enough_ratings }

  validates :rating, presence: true
  has_many :matchmake_ratings

  def self.asked_out_from_matchmake
    Matchmake
      .emailed
      .pluck(:left_profile_id, :right_profile_id).map do |pair|
        pair = Profile.where(id: pair)
        Application.pair(pair.first, pair.second)
      end.flatten
  end

  def other_profile(profile)
    if profile.id == left_profile_id
      right_profile
    elsif profile.id == right_profile_id
      left_profile
    end
  end

  def notify!
    if left_profile.user.blocked?(right_profile.user_id) || right_profile.user.blocked?(left_profile.user_id)
      update!(status: Matchmake.statuses[:automatically_rejected])
      Rails.logger.info "[MATCHMAKING] Automatically rejecting blocked matchmake: #{id}"
    else
      ActiveRecord::Base.transaction do
        update!(status: Matchmake.statuses[:emailed])
        UsersMailer.suggestion(id, left_profile.user_id).deliver_later
        UsersMailer.suggestion(id, right_profile.user_id).deliver_later
      end
    end

  end

  def calculate_rating
    matchmake_ratings.not_skipped.average(:score)
  end

  enum status: [:pending, :rated, :emailed, :manually_rejected, :automatically_rejected]
  validate :not_matching_self

  validates :left_profile_id, uniqueness: {scope: :right_profile_id}, presence: true
  validates :right_profile_id, presence: true
  validate :both_profiles_interested

  def not_matching_self
    if left_profile_id == right_profile_id
      self.errors.add(:left_profile, "must not be the same as the right profile")
    end
  end

  def both_profiles_interested
    return if left_profile.nil? || right_profile.nil?

    if !left_profile.could_be_interested_in?(right_profile)
      self.errors.add(:left_profile, "won't be interested in #{right_profile.name}")
    elsif !right_profile.could_be_interested_in?(left_profile)
      self.errors.add(:right_profile, "won't be interested in #{left_profile.name}")
    end
  end

  def self.can_pair?(left_profile, right_id, exclude = [])
    !cannot_pair?(left_profile, right_id, exclude)
  end

  def self.cannot_pair?(left_profile, right_id, exclude = [])
    has_already_rated_pair = !!exclude.find do |excluded|
      excluded.sort == [left_profile.id, right_id].sort
    end

    has_already_rated_pair || left_profile.id == right_id
  end

  def self.build_left_right(exclude_ids: [], exclude_pairs: [], sex: nil, interested_in_sexes: [])

    seen_frequencies = exclude_pairs.flatten.inject(Hash.new(0)) { |h, v| h[v] += 1; h }

    left_matches = fetch_left(sex: sex, interested_in_sexes: interested_in_sexes, exclude_ids: exclude_ids).shuffle
    left_matches = left_matches.sort_by { |m| seen_frequencies[m.id] } # In-place sort preserves the shuffle order

    chosen_pair = []
    left_matches.each do |left_profile|
      right_matches = fetch_right(exclude_ids: exclude_ids, left_profile: left_profile).sort_by { |id| seen_frequencies[id] }

      chosen_mate = right_matches.select { |right_id| Matchmake.can_pair?(left_profile, right_id, exclude_pairs) }.first

      if chosen_mate.present?
        chosen_pair = [left_profile, Profile.find(chosen_mate)]
        break
      end
    end

    chosen_pair
  end

  def self.fetch_left(sex: nil, interested_in_sexes: [], exclude_ids: [])
    Profile
      .matchmakable
      .filled_out
      .where(sex: sex).interested_in(interested_in_sexes)
      .where.not(user_id: exclude_ids)
  end

  def self.fetch_right(left_profile: nil, exclude_ids: [])
    Profile
      .matchmakable
      .filled_out
      .compatible_with(left_profile)
      .where.not(user_id: exclude_ids)
      .pluck(:id)
  end
end
