class RenameSessions < ActiveRecord::Migration
  def change
  	rename_table :sessions, :tsessions
  end
end
