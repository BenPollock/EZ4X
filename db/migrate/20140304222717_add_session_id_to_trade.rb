class AddSessionIdToTrade < ActiveRecord::Migration
  def change
    add_column :trades, :session_id, :integer
  end
end
