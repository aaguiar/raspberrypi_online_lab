class Cluster

  require 'net/http'
  require 'uri'

  CLUSTER_URL = "172.30.36.234"
  CLUSTER_PORT = 8000

  def self.pis_info
    request_get "/info_pi"
  end

  def self.reserve_pi(id, mac)
    requestget "login", {:macaddr => mac, :userid => id}
  end

  def self.run_code(id, code)
    request_post "run_code", {:userid => id, :code => code }
  end

  def self.logout(id)
    request_get "logout", {:userid => id}
  end

  private
  def self.request_get( action, params = {})
    params ||= {}
    request("GET",action, params)
  end

  def self.request_post( action, params = {})
    params ||= {}
    request("POST",action, params)
  end


  def self.request(method, action, params)
    uri = URI.parse("http://"+CLUSTER_URL+action)
    http = Net::HTTP.new(uri.host, CLUSTER_PORT)
    uri.query = URI.encode_www_form(params)
    if(method=="GET")
      http.request(Net::HTTP::Get.new(uri.request_uri))
    else
      http.request(Net::HTTP::Post.new(uri.request_uri))
    end
  end


end
