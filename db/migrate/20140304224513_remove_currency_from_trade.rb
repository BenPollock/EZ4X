class RemoveCurrencyFromTrade < ActiveRecord::Migration
  def change
    remove_column :trades, :currency, :string
  end
end
