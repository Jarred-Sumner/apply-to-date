class UsersMailer < ApplicationMailer

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
end
