class SessionsController < ApplicationController

  before_filter :login_user
  before_filter :ensure_logged, :only => [:destroy]
  before_filter :ensure_not_logged, :only => [:new, :create]

  def new
    @user = User.new
  end

  def create
    @user = User.find_by_username(params[:user][:username])
    if(@user and @user.password == params[:user][:password])
      SessionsController.create_user_session @user.id
      flash[:notice] = I18n.t('session.notices.login')
      redirect_to root_path
    else
      flash.now[:errors] = I18n.t('session.errors.wrong_credentials')
      @user = User.new
      render action: 'new'
    end

  end

  def destroy
    session.delete(:current_user_id)
    @current_user = nil
    flash[:notice] = I18n.t('session.notices.logout')
    redirect_to root_path
  end

  private
  def ensure_logged
    unless @current_user
      flash[:errors] = I18n.t('session.errors.not_logged')
      redirect_to root_path
    end
  end

  def ensure_not_logged
    if @current_user
      flash[:errors] = I18n.t('session.errors.already_logged')
      redirect_to root_path
    end
  end
end
