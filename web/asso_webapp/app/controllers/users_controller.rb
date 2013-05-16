class UsersController < ApplicationController

  before_filter :login_user
  before_filter :check_admin, :only => [:index, :show, :edit, :destroy]

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
  end

  def new
    @user = User.new
    @roles = Role.all.map { |role| [role.name, role.id] }
  end

  def edit
    @user = User.find(params[:id])
    @roles = Role.all.map { |role| [role.name, role.id] }
  end

  def create
    @user = User.new(:username => params[:user][:username])
    @user.password = params[:user][:password]
    @user.roles << Role.find_by_id(params[:user][:roles]) unless params[:user][:roles].blank?
    if @user.save
      flash[:notice] = I18n.t('user.create.success')
      create_user_session @user.id
      redirect_to root_path
    else
      flash[:errors] = @user.errors.full_messages
      redirect_to new_user_path
    end
  end

  def update
    @user = User.find(params[:id])
    password = params[:user][:password]
    @user.roles << Role.find_by_id(params[:user][:roles]) unless params[:user][:roles].blank?
    if @user.update_attributes(:username => params[:user][:username])
      unless password.blank? || password.length >= 6
        u = User.new
        u.valid?
        flash[:errors] = u.errors[:password].map { |msg| u.errors.full_message(:password, msg) }
        redirect_to :users
      else
        @user.password = password
        @user.save
        flash[:notice] = I18n.t('user.update.success')
        redirect_to :users
      end
    else
      flash[:errors] = @user.errors.full_messages
      redirect_to :users
    end
  end

  def destroy
    @user = User.find(params[:id])
    if @user and @user.destroy
      if params[:id].to_s == session[:current_user_id].to_s
        session.delete(:current_user_id)
        @current_user = nil
      end
      flash[:notice] = I18n.t('user.destroy.success')
      redirect_to :users
    else
      flash.now[:errors] = I18n.t('user.destroy.errors')
      render action: :index
    end
  end

  protected
  def create_user_session(id)
    session[:current_user_id] = id
  end
end
