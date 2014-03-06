class RemoveTradeIdFromSession < ActiveRecord::Migration
  def change
    remove_column :sessions, :trade_id, :string
    #remove_column :sessions, :integer, :string
  end
end
