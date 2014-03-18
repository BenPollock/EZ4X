class TsessionsController < ApplicationController
  	before_filter :authenticate_user!
	
	def create
		@tsession = Tsession.new
		@tsession.user_id = current_user.id
		begin
			@tsession.cash = params[:cash].to_i * 10000
			@tsession.leverage = params[:leverage].to_i
		rescue
			render status: 500
		end

		@tsession.borrowed = 0
		respond_to do |format|
			if @tsession.save
				format.json {render :json => @tsession.cash}
			else
				render status: 500
			end
		end
	end

	def latest
		respond_to do |format|
			#Get the latest session if it exists
			@position = Position.new
			@position.units = 0
			@tsession = "empty"
			if Tsession.exists? (['user_id = ?', current_user.id])
				@tsession = Tsession.where("user_id = ?", current_user.id).order("created_at DESC").first
				if Position.exists? (['tsession_id = ?', @tsession.id])
					@position = Position.where("tsession_id = ?", @tsession.id).first
				end
				format.json {render :json => {empty: "no", cash: @tsession.cash, position: @position.units, borrowed: @tsession.borrowed}}
			else
				format.json {render :json => {empty: "empty", position: @position.units}}
			end
		end

	end

	def history
		@user_history = current_user.tsessions
	end

end
