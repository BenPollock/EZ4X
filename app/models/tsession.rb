class Tsession < ActiveRecord::Base

	belongs_to :user
	has_many :positions
	has_many :trades
end
