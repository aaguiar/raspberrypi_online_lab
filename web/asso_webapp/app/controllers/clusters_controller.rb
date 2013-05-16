class ClustersController < ApplicationController
  before_filter :login_user



  def pi_info

     a =  Cluster::pis_info

     respond_to do |format|
       format.json { render :json =>  a.body }
     end

  end

end
