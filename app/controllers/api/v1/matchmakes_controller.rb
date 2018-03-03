class Api::V1::MatchmakesController < Api::V1::ApplicationController
  before_action :require_login

  def new
    sex = ['male', 'female'].sample
    interested_in_sexes = current_user.interested_in_sexes

    rated_pairs = Matchmake.joins(:matchmake_ratings).where(matchmake_ratings: { user_id: current_user.id }).pluck(:left_profile_id, :right_profile_id)

    left_profile, right_profile = Matchmake.build_left_right(
      exclude_ids: [current_user.id],
      exclude_pairs: rated_pairs,
      sex: sex,
      interested_in_sexes: interested_in_sexes
    )

    @matchmake = Matchmake.new(left_profile: left_profile, right_profile: right_profile)
    render json: MatchmakeSerializer.new(@matchmake, {include: [:left_profile, :right_profile]}).serializable_hash
  end

  def create
    left_profile = Profile.where(visible: true).find(params[:left_profile_id])
    right_profile = Profile.where(visible: true).find(params[:right_profile_id])

    if left_profile.could_be_interested_in?(right_profile) && right_profile.could_be_interested_in?(left_profile)
      ActiveRecord::Base.transaction do
        matchmake = Matchmake.where("(left_profile_id = ? AND right_profile_id = ?) OR (right_profile_id = ? AND left_profile_id = ?)", left_profile.id, right_profile.id, left_profile.id, right_profile.id).first

        if matchmake.nil?
          matchmake = Matchmake.create!(left_profile: left_profile, right_profile: right_profile)
        end

        score = Integer(params[:rating])

        matchmake_rating = MatchmakeRating.where(matchmake: matchmake, user_id: current_user.id).first_or_initialize
        matchmake_rating.score = score
        matchmake_rating.save!

        matchmake.update(rating: matchmake.calculate_rating)

        if current_user.shuffle_cooldown? && !current_user.should_reset_shuffle_session?
          matchmade_count_during_cooldown = MatchmakeRating
            .where(user_id: current_user.id)
            .where("score > 0")
            .where("created_at BETWEEN ? AND ?", current_user.last_shuffled_at, DateTime.now)
            .count

          if matchmade_count_during_cooldown >= User.matchmake_reset_offset
            current_user.clear_shuffle_session!
          end
        end
      end
    end

    render json: {data: nil}
  end

end