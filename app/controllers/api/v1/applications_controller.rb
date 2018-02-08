class Api::V1::ApplicationsController < Api::V1::ApplicationController

  def create
    if create_params[:social_links].blank?
      raise ArgumentError.new("Please include at least one social profile")
    end

    @application = Application.create!(create_params.merge(profile_id: params[:profile_id]))

    render json: ApplicantApplicationSerializer.new(@application).serializable_hash
  rescue ArgumentError => e
    render_error(message: e.message)
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end
  
  def external_authentication
    byebug
  end

  def show
    if params[:email].blank?
      render json: ApplicantApplicationSerializer.new(nil).serializable_hash
      return
    end

    @application = Application.find_by(profile: params[:profile_id], email: String(params[:email]).downcase)

    render json: ApplicantApplicationSerializer.new(@application).serializable_hash
  end

  def update

  end

  private def create_params
    params
      .require(:application)
      .permit(:status, :social_links, :sections, :name, :photos, :email, :name)
  end

end