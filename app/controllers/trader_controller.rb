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
			#@tsession.cash = @tsession.cash.to_i - (quantity.to_i * @askrate).to_i
			@rate = @askrate
		else
			#@tsession.cash = @tsession.cash.to_i - (quantity.to_i * @bidrate).to_i
			@rate = @bidrate
		end
		#@tsession.save


		#Buy/Sell Logic:
		#1.Buy with 0 or positive positions: user puts up small amount of money, large leverage
		#2.Buy with negative positions: user puts up full money for all positions until 0.  Rest follow above logic.
		#3.Sell with 0 or negative positions: user puts up no money or leverage, but has negative positions
		#4.Sell with positive positions: user gets small amount of money, large leverage until positions hit 0.  Rest follow above logic.
		if Position.exists? (['tsession_id = ?', tsessionid])
			@position = Position.where("tsession_id = ?", tsessionid).first

			if quantity.to_i >= 0
				if @position.units >= 0
					total_cost = (quantity.to_i * @rate).to_i
					fronted_money = (total_cost / @tsession.leverage).to_i
					borrowed_money = total_cost - fronted_money
					@tsession.borrowed = @tsession.borrowed + borrowed_money
					@tsession.cash = @tsession.cash - fronted_money
				else
					additional_units = @position.units + quantity.to_i
					cost_to_zero = 0
					if(additional_units < 0)
						cost_to_zero = quantity.to_i * @rate
					else
						cost_to_zero = (@position.units * - 1) * @rate
					end
					@tsession.cash = @tsession.cash - cost_to_zero
					if(additional_units > 0)
						total_cost = (additional_units * @rate).to_i
						fronted_money = (total_cost / @tsession.leverage).to_i
						borrowed_money = total_cost - fronted_money
						@tsession.borrowed = @tsession.borrowed + borrowed_money
						@tsession.cash = @tsession.cash - fronted_money
					end
				end
			else
				if @position.units > 0
					#cost_to_zero = @position.units * @rate
					total_cost = ((quantity.to_i * @rate).to_i)*-1
					#pay off borrowed amount first
					if total_cost <= @tsession.borrowed
						@tsession.borrowed = @tsession.borrowed - total_cost
					else
						total_cost = total_cost - @tsession.borrowed
						@tsession.borrowed = 0
						@tsession.cash = @tsession.cash + total_cost
					end


				else
					total_cost = (quantity.to_i * @rate).to_i
					@tsession.cash = @tsession.cash - total_cost
				end
			end
			@tsession.save
			@position.units = @position.units.to_i + quantity.to_i
			@position.save
			#need to update position table
		else
			#if no position exists, buy/sell logic will always follow 1 or 3
			if quantity.to_i >= 0
				total_cost = (quantity.to_i * @rate).to_i
				fronted_money = (total_cost / @tsession.leverage).to_i
				borrowed_money = total_cost - fronted_money
				@tsession.borrowed = @tsession.borrowed + borrowed_money
				@tsession.cash = @tsession.cash - fronted_money
			else
				total_cost = (quantity.to_i * @rate).to_i
				@tsession.cash = @tsession.cash - total_cost
			end
			@tsession.save

			@position = Position.new
			@position.tsession_id = tsessionid
			@position.units = quantity
			@position.save

		end


		respond_to do |format|
			format.json {render :json => {cash: @tsession.cash, position: @position.units, rate: @rate, borrowed: @tsession.borrowed}}
			#format.json {render :json => @currency}
		end
	end

end
