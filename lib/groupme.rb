class Groupme < Struct.new(:access_token)
  BASE_URL = "https://api.groupme.com/v3"

  def access_token
    "7929728000a001364c4467ef553e28f2"
  end

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
    "/v3#{path}"
  end

  def get(path: nil, options: {})
    process_response(client.get(build_url(path), options.merge(token: access_token)))
  end

  def post(path: nil, options: {})
    response = client.post do |request|
      request.url build_url(path + "?token=#{access_token}")
      request.headers['Content-Type'] = 'application/json'

      request.body = options.to_json
    end

    process_response(response)
  end

  def create_group(options = {})
    post(path: "/groups", options: options)
  end

  def add_member(group_id, nickname, phone_number)
    post(path: "/groups/#{group_id}/members/add", options: {
      members: [
        {
          nickname: nickname,
          phone_number: phone_number
        }
      ]
    })
  end

  def send_message(group_id, message_id, message)
    post(path: "/groups/#{group_id}/messages", options: {
      message: {
        source_guid: message_id,
        text: message
      }
    })
  end

end