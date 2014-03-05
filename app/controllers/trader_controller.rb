class TraderController < ApplicationController
  	before_filter :authenticate_user!
	def trader
	end

	def buy

		#Get the parameters
		#currency = params[:currency]
		quantity = params[:quantity]

		#This is working, now we need to manipulate the database

		#Get session


		#Create trade in database
		@trade = Trade.new
		@trade.units = quantity.to_i
		#Get the most recent session under the user
		tsessionid = Tsession.where("user_id = ?", current_user.id).order("created_on DESC").find(1).id
		@trade.tsession_id = tsessionid
		@trade.save

		
		#Get current session, add new position or increase existing position, decrease money available
		@tsession = tsession.find(tsessionid)
		#Get most recent quote for @tession.currency
		#Temporarily set it to 13735
		@tsession.cash = @tsession.cash - (units * 13735)

		if Position.exists? (['tsession_id = ?', tsessionid])
			@position = Position.where("tsession_id = ?", tsessionid).find(1)
			#need to update position table
		end


		respond_to do |format|
			format.json {render :json => {}}
			#format.json {render :json => @currency}
		end
	end

end
