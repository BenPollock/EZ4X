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
		tsessionid = Tsession.where("user_id = ?", current_user.id).order("created_at DESC").first.id
		@trade.tsession_id = tsessionid
		@trade.save

		
		#Get current session, add new position or increase existing position, decrease money available
		@tsession = Tsession.find(tsessionid)
		#Get most recent quote for @tession.currency
		#Temporarily set it to 13735

		#If quantity is positive, use ask, else use bid
		@rate = 0
		if quantity.to_i >= 0
			@tsession.cash = @tsession.cash.to_i - (quantity.to_i * 13729).to_i
			@rate = 13729
		else
			@tsession.cash = @tsession.cash.to_i - (quantity.to_i * 13727).to_i
			@rate = 13727
		end
		@tsession.save

		if Position.exists? (['tsession_id = ?', tsessionid])
			@position = Position.where("tsession_id = ?", tsessionid).first
			@position.units = @position.units.to_i + quantity.to_i
			@position.save
			#need to update position table
		else
			@position = Position.new
			@position.tsession_id = tsessionid
			@position.units = quantity
			@position.save
		end


		respond_to do |format|
			format.json {render :json => {cash: @tsession.cash, position: @position.units, rate: @rate}}
			#format.json {render :json => @currency}
		end
	end

end
