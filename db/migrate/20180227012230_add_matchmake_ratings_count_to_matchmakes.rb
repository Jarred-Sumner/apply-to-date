class AddMatchmakeRatingsCountToMatchmakes < ActiveRecord::Migration[5.1]
  def change
    add_column :matchmakes, :matchmake_ratings_count, :integer, default: 0, null: false

    Matchmake.reset_column_information
    Matchmake.find_each do |p|
      Matchmake.reset_counters p.id, :matchmake_ratings
    end

    add_index :matchmakes, :matchmake_ratings_count
    add_index :matchmakes, :rating
  end
end
