class RemoveCashFromTsession < ActiveRecord::Migration
  def change
    remove_column :tsessions, :cash, :decimal
  end
end
