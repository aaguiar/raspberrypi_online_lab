# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
AssoWebapp::Application.initialize!

AssoWebapp::Application.configure do
  # Enable session cookies
  config.action_controller.session_store :cookie_store
end
