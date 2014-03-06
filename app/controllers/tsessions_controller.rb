class TsessionsController < ApplicationController
  	before_filter :authenticate_user!
	
	def create
		@tsession = Tsession.new
		@tsession.user_id = current_user.id
		begin
			@tsession.cash = params[:cash].to_i * 10000
		rescue
			render status: 500
		end

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
			@Tsession = "empty"
			if Tsession.exists? (['user_id = ?', current_user.id])
				@Tsession = Tsession.where("user_id = ?", current_user.id).order("created_at DESC").first
				if Position.exists? (['tsession_id = ?', @Tsession.id])
					@position = Position.where("tsession_id = ?", @Tsession.id).first
				end
				format.json {render :json => {empty: "no", cash: @Tsession.cash, position: @position.units}}
			else
				format.json {render :json => {empty: "empty", position: @position.units}}
			end
		end

	end

end
