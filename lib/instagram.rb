class Instagram < Struct.new(:access_token)
  BASE_URL = "https://api.instagram.com/v1"

  def client
    @faraday ||= Faraday.new(BASE_URL) do |faraday|
      faraday.response :logger
      faraday.adapter  Faraday.default_adapter
    end
  end

  def process_response(response)
    JSON.parse(response.body).with_indifferent_access
  end

  def build_url(path)
    path
  end

  def get(path: nil, options: {})
    process_response(client.get(build_url(path), options.merge(access_token: access_token)))
  end

  def recent_posts(options = {})
    get(path: "users/self/media/recent/", options: options)
  end

  def profile(options = {})
    get(path: "users/self", options: options)
  end
end