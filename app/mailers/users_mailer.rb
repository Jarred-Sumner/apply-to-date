class UsersMailer < ApplicationMailer
  include ActionView::Helpers::TextHelper
  layout 'emails'

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.users_mailer.welcome.subject
  #
  def welcome(user_id)
    @user = User.find(user_id)
    @edit_profile_url = Api::V1::ApplicationController.build_frontend_uri("/#{@user.username}/edit", {})
    @profile_url = Api::V1::ApplicationController.build_frontend_uri("/#{@user.username}", {})

    @preferred_gender = 'guys' if @user.interested_in_men?
    @preferred_gender = 'women' if @user.interested_in_women?
    @preferred_gender = 'people' if @user.interested_in_other? || (@user.interested_in_men? && @user.interested_in_women?)

    mail to: @user.email, subject: "Let's get you some dates"
  end

  def suggestion(matchmake_id, user_id)
    @matchmake = Matchmake.find(matchmake_id)
    @user = User.find(user_id)

    @profile = @matchmake.other_profile(@user.profile)
    if @matchmake.left_profile_id == @profile.id
      if @matchmake.notified_left_profile_at.present?
        Rails.logger.info "Halting Matchmake suggestion email (#{@matchmake.id}: #{@profile.id}) because already notified"
      else
        @matchmake.update(notified_left_profile_at: DateTime.now)
      end
    else
      if @matchmake.notified_right_profile_at.present?
        Rails.logger.info "Halting Matchmake suggestion email (#{@matchmake.id}: #{@profile.id}) because already notified"
      else
        @matchmake.update(notified_right_profile_at: DateTime.now)
      end
    end


    @profile_url = Api::V1::ApplicationController.build_frontend_uri("/#{@profile.id}", {
      utm_medium: 'email',
      utm_source: 'matchmaking',
      utm_content: 'suggestion'
    })

    @raters = Profile.real.where(user_id: @matchmake.matchmake_ratings.quality_match.pluck(:user_id))
    mail to: @user.email, subject: "#{pluralize(@raters.count, 'people')} think you should ask out #{@profile.name}"
  end
end
