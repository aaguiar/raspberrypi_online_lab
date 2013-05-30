class Script < ActiveRecord::Base
  belongs_to :user
  attr_accessible :code, :title


  #get all users scripts titles
  #get script
  #delete script
  #save script (creates a new one if not exists)
end
