class Matchmake < ApplicationRecord
  belongs_to :left_profile, class_name: Profile
  belongs_to :right_profile, class_name: Profile

  validates :rating, presence: true
  has_many :matchmake_ratings

  def calculate_rating
    matchmake_ratings.average(:score)
  end

  enum status: [:pending, :rated]
  validate :not_matching_self

  def not_matching_self
    if left_profile_id == right_profile_id
      self.errors.add(:left_profile, "must not be the same as the right profile")
    end
  end


  def self.build_left_right(exclude: [], sex: nil, interested_in_sexes: [])
    left_matches = fetch_left(sex: sex, interested_in_sexes: interested_in_sexes).shuffle

    chosen_pair = []
    left_matches.each do |left_profile|
      right_matches = fetch_right(left_profile: left_profile)
    
      chosen_mate = right_matches.reject do |right_id|
        has_already_rated_pair = !!exclude.find do |excluded| 
          excluded.sort == [left_profile.id, right_id].sort
        end

        has_already_rated_pair || left_profile.id == right_id
      end.first

      if chosen_mate.present?
        chosen_pair = [left_profile, Profile.find(chosen_mate)]
        break
      end
    end

    chosen_pair
  end

  def self.fetch_left(sex: nil, interested_in_sexes: [])
    Profile
      .real
      .where("latitude IS NOT NULL and longitude IS NOT NULL")
      .where(sex: sex).interested_in(interested_in_sexes)
  end

  def self.fetch_right(left_profile: nil)
    Profile
      .compatible_with(left_profile)
      .real
      .pluck(:id)
  end
end
