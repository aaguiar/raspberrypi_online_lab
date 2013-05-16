class User < ActiveRecord::Base

  include BCrypt
  has_and_belongs_to_many :roles
  attr_accessible :username
  before_create :add_role

  # Validations
  validates :username,
    :presence => { :message => I18n.t('user.create.errors.username_missing') },
    :length => { :minimum => 6, :message => I18n.t('user.create.errors.username_too_short') },
    :uniqueness => { :message => I18n.t('user.create.errors.username_already_in_use') }
  validates :password,
    :presence => { :message => I18n.t('user.create.errors.password_missing') },
    :length => { :minimum => 6, :message => I18n.t('user.create.errors.password_too_short') }

  def password
    return unless password_hash
    @password ||= Password.new(password_hash)
  end

  def password= (new_password)
    # Passwords of less than 6 characters won't be set
    return unless new_password and new_password.length >= 6
    @password = Password.create(new_password)
    self.password_hash = @password
  end

  def role? (role)
    return !! self.roles.find_by_name(role.to_s.camelize)
  end

  private
  def add_role
    self.roles << Role.find_by_name(:normal.to_s.camelize)
  end
end
