class AddCashToSessions < ActiveRecord::Migration
  def change
    add_column :sessions, :cash, :decimal
  end
end
