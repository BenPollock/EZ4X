class RemoveIntegerFromTrade < ActiveRecord::Migration
  def change
    remove_column :trades, :integer, :string
  end
end
