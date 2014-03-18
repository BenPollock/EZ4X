class AddStartingMoneyToTsessions < ActiveRecord::Migration
  def change
    add_column :tsessions, :starting_money, :integer
  end
end
