class RecalculateRatings < ActiveRecord::Migration[5.1]
  def change
    Matchmake.find_each { |matchmake| matchmake.update(rating: matchmake.calculate_rating) }
  end
end
