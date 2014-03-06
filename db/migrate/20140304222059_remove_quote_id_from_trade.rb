class RemoveQuoteIdFromTrade < ActiveRecord::Migration
  def change
    remove_column :trades, :quote_id, :string
   # remove_column :trades, :integer, :string
  end
end
