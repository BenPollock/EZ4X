class AddLeverageToTsessions < ActiveRecord::Migration
  def change
    add_column :tsessions, :leverage, :integer
  end
end
