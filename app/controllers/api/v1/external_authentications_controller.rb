class Api::V1::ExternalAuthenticationsController < Api::V1::ApplicationController
  before_action :require_login, only: :index


  def index
    render json: ExternalAuthenticationSerializer.new(current_user.external_authentications).serializable_hash
  end

  def show
    auth = ExternalAuthentication.where("user_id = ? OR user_id IS NULL", current_user.try(:id)).find(params[:id])
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
      @external_authentication = ExternalAuthentication.initialize_from_twitter_credentials(access_token: params[:access_token], access_token_secret: params[:access_token_secret])
    else
      return render_error(message: "Something went wrong while trying to verify your account")
    end

    if logged_in?
      @external_authentication.user_id = current_user.id
    end

    @external_authentication.save!

    if logged_in? && !current_user.profile.verified_networks.where(external_authentication_id: @external_authentication.id).exists?
      VerifiedNetwork.create!(profile_id: current_user.profile.id, external_authentication_id: @external_authentication.id)
    end

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

        if current_application.present?
          VerifiedNetwork.create!(
            external_authentication_id: auth.id,
            application_id: current_application.id,
          )

          current_application.social_links = current_application.social_links.merge(
            auth.build_social_link_entry
          )

          if current_application.name.blank? && auth.name.present?
            current_application.name = auth.name.split(" ").first
          end

          current_application.save!
        elsif auth_params[:profile_id].present? && current_user.profile.try(:id) == auth_params[:profile_id] && !is_mobile?
          VerifiedNetwork.create!(
            external_authentication_id: auth.id,
            profile_id: auth_params[:profile_id]
          )

          auth.update!(
            user_id: current_user.id
          )

          if auth_params[:from_social_link] == 'true'
            current_user.profile.update(
              social_links: current_user.profile.social_links.merge(
                auth.build_social_link_entry
              )
            )
          else
            current_user.profile.update(
              recommended_contact_methods: current_user.profile.external_authentications.pluck(:provider).uniq,
              recommended_contact_method: auth.provider,
            )
          end
        end

        if auth_params[:redirect_path].present?
          opts = {}

          if is_mobile?
            opts[:e] = auth.id
          end

          if auth_params[:redirect_path].include?("/apply")
            opts[auth.provider] = auth.id

            if current_user.blank?
              if redirect_path_params[:email].blank? && auth.email.present?
                opts[:email] = auth.email
              end

              if redirect_path_params[:name].blank? && auth.name.present?
                opts[:name] = auth.name
              end

              if redirect_path_params[:username].blank? && auth.username.present?
                opts[:username] = auth.username
              end
            end
          end

          redirect_to_frontend auth_params[:redirect_path], opts, false
        elsif current_application.present?
          redirect_to_frontend("/#{current_application.profile_id}/apply",
            applicationId: current_application.id,
            email: current_application.email

        )
        elsif auth_params[:signIn] == 'true' && auth.get_user.present?
          if is_mobile?
            auth.get_user.generate_login_token!

            token = auth.get_user.login_token
            redirect_to_frontend "/welcome?t=#{token}"
          else
            auto_login(auth.get_user, true)
            redirect_to_frontend "/welcome"
          end
        elsif auth_params[:signIn] == 'true' && auth.get_user.blank?
          redirect_to_frontend "/sign-up/#{auth_hash.provider}/#{auth.id}"
        elsif auth.user.present?
          redirect_to_frontend "/#{auth.user.username}"
        elsif auth_params[:signUp] == 'true'
          if auth_params[:mobileRedirect] == 'true'
            redirect_to_frontend "/sign-up/#{auth_hash.provider}/#{auth.id}?mobileRedirect=true"
          else
            redirect_to_frontend "/sign-up/#{auth_hash.provider}/#{auth.id}"
          end
        end
      end
    else
      redirect_to_frontend "/", {"login-failure" => true}
    end
  end

  def render_external_authentication(auth)
    render json: ExternalAuthenticationSerializer.new(auth).serializable_hash
  end

  protected

  def current_application
    return @current_application if @current_application
    return nil if auth_params.blank?

    if auth_params[:application_id].present?
      @current_application = Application.find_by(id: auth_params[:application_id])
    elsif auth_params[:applicant_email].present? && auth_params[:profile_id].present?
      @current_application = Application.fetch(email: auth_params[:applicant_email], profile_id: auth_params[:profile_id])
    end
  end

  def auth_hash
    request.env['omniauth.auth']
  end

  def auth_params
    request.env["omniauth.params"].with_indifferent_access
  end

  def redirect_path_params
    return @redirect_path_params if @redirect_path_params
    query = Addressable::URI.parse(auth_params[:redirect_path]).query_values

    @redirect_path_params = (query || {}).with_indifferent_access
  end

  def claim_params
    params.permit(:access_token, :expiration, :provider, :application_email, :profile_id)
  end

  def redirect_to_frontend(path, params = {}, merge = true)
    super(path, params, merge, is_mobile?, auth_params[:mobile_platform] || 'ios')
  end

  def is_mobile?
    auth_params[:is_mobile].present?
  end

end