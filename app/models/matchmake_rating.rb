class MatchmakeRating < ApplicationRecord
  belongs_to :user
  belongs_to :matchmake, counter_cache: true

  validates :score, presence: true,  numericality: { only_integer: true, greater_than: -1, less_than: 6 }
  validates :matchmake_id, uniqueness: { scope: :user_id }
end
