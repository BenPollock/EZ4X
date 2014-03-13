class TraderController < ApplicationController
  	before_filter :authenticate_user!
  	require 'net/http'
  	require 'json'

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
		#@data = JSON.load("http://ez4x-rates.herokuapp.com/Convert?symbol=EURUSD")
		resp = Net::HTTP.get_response(URI.parse("http://ez4x-rates.herokuapp.com/Convert?symbol=EURUSD"))
		data = JSON.parse(resp.body)

		askstring = String.try_convert(data["Ask"])
		bidstring = String.try_convert(data["Bid"])


		#Remove decimal
		askstring = askstring.delete ('.')
		bidstring = bidstring.delete ('.')

		#Remove extra digit (we can change this later)
		askstring = askstring[0, 5]
		bidstring = bidstring[0, 5]

		@askrate = askstring.to_i
		@bidrate = bidstring.to_i



		@rate = 0
		if quantity.to_i >= 0
			#@tsession.cash = @tsession.cash.to_i - (quantity.to_i * 13729).to_i
			@tsession.cash = @tsession.cash.to_i - (quantity.to_i * @askrate).to_i
			@rate = @askrate
		else
			@tsession.cash = @tsession.cash.to_i - (quantity.to_i * @bidrate).to_i
			@rate = @bidrate
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
