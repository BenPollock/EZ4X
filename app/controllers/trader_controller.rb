class TraderController < ApplicationController
  	before_filter :authenticate_user!
	def trader
	end

	def buy

		#Get the parameters
		@currency = params[:currency]
		@quantity = params[:quantity]

		#This is working, now we need to manipulate the database

		#Get most recent quote
		#Create trade in database

		##** Session should be created through ajax at app start, for the current user.  We'll then use the latest session
		#Get current session, add new position or increase existing position, decrease money available

		respond_to do |format|
			format.json {render :json => {}}
			#format.json {render :json => @currency}
		end
	end

end
