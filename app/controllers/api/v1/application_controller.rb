class Api::V1::ApplicationController < ActionController::Base
  include Sorcery::Controller
  after_action :set_content_type

  def set_content_type
    self.content_type = "application/vnd.api+json"
  end

  def current_profile
    @current_profile ||= current_user.try(:profile)
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

  def self.frontend_hostname(is_mobile = false, mobile_platform = "ios")
    if is_mobile && mobile_platform == 'ios'
      Rails.application.secrets[:ios_base_uri]
    elsif is_mobile && mobile_platform == 'android'
      Rails.application.secrets[:android_base_uri]
    else
      Rails.application.secrets[:frontend_url]
    end
  end

  def self.build_frontend_uri(path, params, merge = true, is_mobile = false, mobile_platform = 'ios')
    hostname = frontend_hostname(is_mobile, mobile_platform)
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

  def current_device
    @current_device ||= Device.find_by(uid: Device.normalize_from_headers(request.headers)[:uid])
  end

end