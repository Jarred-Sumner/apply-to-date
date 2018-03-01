class MatchmakeRating < ApplicationRecord
  belongs_to :user
  belongs_to :matchmake, counter_cache: true

  scope :skipped, lambda { where(rating: 0) }
  scope :not_skipped, lambda { where("score > 0") }
  scope :quality_match, lambda { where("score >= ?", Matchmake::MINIMUM_AVERAGE_RATING) }

  validates :score, presence: true,  numericality: { only_integer: true, greater_than: -1, less_than: 6 }
  validates :matchmake_id, uniqueness: { scope: :user_id }
end
