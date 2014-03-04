class AddCurrencyToSession < ActiveRecord::Migration
  def change
    add_column :sessions, :currency, :string
  end
end
