require 'faraday-manual-cache'

module Yelp
  BASE_URL = "https://api.yelp.com/v3"

  def self.client
    @faraday ||= Faraday.new(BASE_URL) do |faraday|
      faraday.use :manual_cache,
        expires_in: 24.hours,
        store: :redis_store,
        store_options: { host: Rails.application.secrets[:redis_host], port: Rails.application.secrets[:redis_port] }
        faraday.response :logger
      faraday.adapter  Faraday.default_adapter
    end
  end

  def self.process_response(response)
    JSON.parse(response.body).with_indifferent_access
  end

  def self.build_url(path)
    path
  end

  def self.get(path: nil, options: {})
    response = client.get(build_url(path), options) do |req|
      req.headers["Authorization"] = "Bearer #{Rails.application.secrets[:yelp_key]}"
    end

    process_response(response)
  end

  def self.search(latitude: nil, longitude: nil, query: nil)
    get(path: "autocomplete", options: {
      text: query,
      latitude: latitude,
      longitude: longitude,
    })
  end

  def self.business(id)
    get(path: "businesses/#{id}");
  end

  def self.reviews(business_id)
    get(path: "businesses/#{business_id}/reviews");
  end

end