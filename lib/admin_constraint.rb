class AdminConstraint
  def matches?(request)
    return true if Rails.env.development?
    return false unless request.session[:user_id]
    user = User.find request.session[:user_id]
    user && user.admin?
  end
end
