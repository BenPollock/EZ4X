class TraderController < ApplicationController
  	before_filter :authenticate_user!
	def trader
	end

	def buy

		#Get the parameters
		

		respond_to do |format|
			format.json {render :json => {}}
		end
	end

end
