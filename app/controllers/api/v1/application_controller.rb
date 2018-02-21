class Api::V1::ApplicationController < ActionController::Base
  include Sorcery::Controller
  after_action :set_content_type

  def set_content_type
    self.content_type = "application/vnd.api+json"
  end

  def render_error(message: "Something went wrong. Please try again.", status: 400)
    render status: status, json: {
      object: 'error',
      message: message,
      status: status
    }
  end

  def render_forbidden
    render_error(message: "That resource is unavailable.", status: 403)
  end

  def render_validation_error(e)
    render_error(message: e.record.errors.full_messages)
  end

  def self.build_frontend_uri(path, params, merge = true)
    uri = Addressable::URI.parse(Rails.application.secrets[:frontend_url] + path)
    if merge
      uri.query_values = (uri.query_values || {}).merge(params) if params.present?
    else
      uri.query_values = params
    end

    uri
  end

  def redirect_to_frontend(path, params = {}, merge = true)
    uri = Api::V1::ApplicationController.build_frontend_uri(path, params)
    redirect_to uri.to_s
  end


end