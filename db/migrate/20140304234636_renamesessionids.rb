class Renamesessionids < ActiveRecord::Migration
  def change
  	rename_column :positions, :session_id, :tsession_id
  	rename_column :trades, :session_id, :tsession_id
  end
end
