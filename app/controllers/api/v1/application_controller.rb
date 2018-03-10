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

  def self.build_frontend_uri(path, params, merge = true, is_mobile = false)
    hostname = is_mobile ? Rails.application.secrets[:mobile_base_uri] : Rails.application.secrets[:frontend_url]
    uri = Addressable::URI.parse(hostname + path)
    if merge
      uri.query_values = (uri.query_values || {}).merge(params) if params.present?
    else
      uri.query_values = params
    end

    uri
  end

  def redirect_to_frontend(path, params = {}, merge = true, is_mobile = false)
    uri = Api::V1::ApplicationController.build_frontend_uri(path, params, merge, is_mobile)
    redirect_to uri.to_s
  end

  def set_mobile_cookie
    cookies[:has_app_installed] = {
      value: 'true',
      domain: :all,
      expires: 1.year.from_now
    }
  end

  def apply_mobile_cookie
    set_mobile_cookie
    redirect_to_frontend("shuffle", {}, true, true)
  end

end