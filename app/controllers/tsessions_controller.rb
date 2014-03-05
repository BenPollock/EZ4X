class TsessionsController < ApplicationController
  	before_filter :authenticate_user!
	
	def create
		@tsession = Tsession.new
		@tsession.user_id = current_user.id
		begin
			@tsession.cash = params[:cash].to_i * 100
		rescue
			render status: 500
		end

		respond_to do |format|
			if @tsession.save
				format.json {render :json => {}}
			else
				render status: 500
			end
		end


	end

end
