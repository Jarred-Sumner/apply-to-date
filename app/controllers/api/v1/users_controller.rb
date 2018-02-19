class Api::V1::UsersController < Api::V1::ApplicationController

  def create
    ActiveRecord::Base.transaction do
      if create_params[:sex].blank?
        return render_error(message: "Please choose your gender")
      end

      if create_params[:interested_in_men].blank? && create_params[:interested_in_women].blank? && create_params[:interested_in_other].blank?
        return render_error(message: "Please fill out the interested in section")
      end

      @user = User.create!(create_params.merge(password_confirmation: create_params[:password]))

      @profile = Profile.create!(
        create_profile_params.merge(
          user: @user,
          id: @user.username,
          visible: false,
          name: @external_authentication.try(:name).try(:split, ' ').try(:first),
        )
      )

      if params[:external_authentication_id].present?
        @external_authentication = ExternalAuthentication.find(params[:external_authentication_id])
        @external_authentication.user = @user
        @external_authentication.save!

        VerifiedNetwork.create!(profile_id: @profile.id, external_authentication_id: @external_authentication.id)
        @profile.update(recommended_contact_method: @external_authentication.provider)
      end      

      auto_login(@user, true)
      render json: UserSerializer.new(@user, {include: [:profile]}).serializable_hash
    end
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end

  def me
    if logged_in?
      render json: UserSerializer.new(current_user, {include: [:profile]}).serializable_hash
    else
      render json: { data: nil }
    end
  end

  private def create_params
    params.require(:user).permit([:email, :username, :password, :interested_in_men, :interested_in_women, :interested_in_other, :sex])
  end

  private def create_profile_params
    params.require(:profile).permit([
      :location, :latitude, :longitude
    ])
  end

end