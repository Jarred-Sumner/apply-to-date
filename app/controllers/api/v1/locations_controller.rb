class Api::V1::LocationsController < Api::V1::ApplicationController
  before_action :require_login

  def search
    results = Yelp.search(search_params.merge(
      query: params[:query]
    ))

    render json: {
      businesses: results[:businesses]
    }
  end

  def show
    business = Yelp.business(params[:id])
    reviews = Yelp.reviews(params[:id])

    render json: business.merge(reviews: reviews["reviews"])
  end

  def search_params
    {
      latitude: params[:latitude] || current_profile.latitude,
      longitude: params[:longitude] || current_profile.longitude,
    }
  end
end