require 'test_helper'

class ScriptsControllerTest < ActionController::TestCase
  test "should get get_script" do
    get :get_script
    assert_response :success
  end

  test "should get get_all" do
    get :get_all
    assert_response :success
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should get edit" do
    get :edit
    assert_response :success
  end

  test "should get delete" do
    get :delete
    assert_response :success
  end

  test "should get show_all" do
    get :show_all
    assert_response :success
  end

end
