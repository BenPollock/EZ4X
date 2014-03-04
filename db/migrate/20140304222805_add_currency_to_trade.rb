class AddCurrencyToTrade < ActiveRecord::Migration
  def change
    add_column :trades, :currency, :string
  end
end
