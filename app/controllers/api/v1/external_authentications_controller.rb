class Api::V1::ExternalAuthenticationsController < Api::V1::ApplicationController
  before_action :require_login, only: :index

  def index
    render json: ExternalAuthenticationSerializer.new(current_user.external_authentications).serializable_hash
  end

  def show
    auth = ExternalAuthentication.find_by!(user: nil, id: params[:id])
    render_external_authentication(auth)
  end

  def claim
    if claim_params[:provider] == 'facebook'
      credentials = ExternalAuthentication
        .facebook_oauth
        .exchange_access_token_info(params[:access_token])

      if credentials["access_token"].blank?
        return render_error(message: "Something went wrong while verifying your Facebook account.")
      end

      @external_authentication = ExternalAuthentication.initialize_from_facebook_credentials(credentials)
    elsif claim_params[:provider] == 'twitter'
    elsif claim_params[:provider] == 'instagram'
    elsif claim_params[:provider] == 'phone'
      @external_authentication = ExternalAuthentication.create!(username: claim_params[:username], access_token: claim_params[:access_token], provider: 'phone')
    else
      return render_error(message: "Something went wrong while trying to verify your account")
    end

    @external_authentication.save!

    render_external_authentication(@external_authentication)
  rescue Koala::Facebook::OAuthTokenRequestError => e
    render_error(message: "Something went wrong while verifying your Facebook account.")
  rescue ActiveRecord::RecordInvalid => e
    render_validation_error(e)
  end

  def create
    if auth_hash.present? && auth_hash.uid.present? && auth_hash.provider.present?
      ActiveRecord::Base.transaction do
        auth = ExternalAuthentication.update_from_omniauth(auth_hash)

        if auth_params[:application_id].present?
          application = Application.find_by(id: auth_params[:application_id], status: Application.statuses[:pending])

          if application.present?
            VerifiedNetwork.create!(
              external_authentication_id: auth.id,
              application_id: auth_params[:application_id]
            )

            application.social_links = application.social_links.merge(
              auth.build_social_link_entry
            )

            if application.name.blank? && auth.name.present?
              application.name = auth.name.split(" ").first
            end

            application.save!
          end
        elsif auth_params[:profile_id].present? && current_user.profile.try(:id) == auth_params[:profile_id]
          VerifiedNetwork.create!(
            external_authentication_id: auth.id,
            profile_id: auth_params[:profile_id]
          )

          current_user.profile.update(
            recommended_contact_methods: current_user.profile.external_authentications.pluck(:provider).uniq
          )
        end

        if auth_params[:redirect_path].present?
          redirect_to Rails.application.secrets[:frontend_url] + auth_params[:redirect_path]
        else
          if auth.user.present?
            redirect_to Rails.application.secrets[:frontend_url] + "/"
          else
            redirect_to Rails.application.secrets[:frontend_url] + "/sign-up/#{auth_hash.provider}/#{auth.id}"
          end
        end
      end
    else
      redirect_to Rails.application.secrets[:frontend_url] + "?login-failure=true"
    end
  end

  def render_external_authentication(auth)
    render json: ExternalAuthenticationSerializer.new(auth).serializable_hash
  end

  protected

  def auth_hash
    request.env['omniauth.auth']
  end

  def auth_params
    request.env["omniauth.params"].with_indifferent_access
  end

  def claim_params
    params.permit(:access_token, :expiration, :provider, :application_email, :profile_id)
  end
end