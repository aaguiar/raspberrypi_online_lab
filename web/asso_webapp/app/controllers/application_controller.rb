class ApplicationController < ActionController::Base
  protect_from_forgery

  # Access denied exception handling
  class AccessDenied < Exception
  end
  rescue_from AccessDenied do |exception|
    flash[:error] = I18n.t('errors.permissions')
    redirect_to root_url
  end

  def check_user
    login_user
    raise AccessDenied unless @current_user
  end

  def check_admin
    login_user
    raise AccessDenied unless (@current_user && @current_user.role?(:admin))
  end

  def login_user
    @current_user ||= session[:current_user_id] && User.find(session[:current_user_id])
  end
end
