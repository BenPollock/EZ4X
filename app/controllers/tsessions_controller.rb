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
			if Tsession.exists? (['user_id = ?', current_user.id])
				@Tsession = Tsession.where("user_id = ?", current_user.id).order("created_at DESC").first
				format.json {render :json => @Tsession.cash}
			else
				format.json {render :json => {empty: "empty"}}
			end
		end

	end

end
