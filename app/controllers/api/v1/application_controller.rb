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

end