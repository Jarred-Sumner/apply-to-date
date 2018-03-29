class Api::V1::GeocodeController < Api::V1::ApplicationController

  def create
    result = Geokit::Geocoders::GoogleGeocoder.reverse_geocode("#{params[:latitude]},#{params[:longitude]}", {result_type: "locality" })
    render json: result.as_json
  end

end