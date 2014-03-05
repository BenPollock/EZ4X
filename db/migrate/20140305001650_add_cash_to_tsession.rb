class AddCashToTsession < ActiveRecord::Migration
  def change
    add_column :tsessions, :cash, :integer
  end
end
