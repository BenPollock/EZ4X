class AddBorrowedToTsessions < ActiveRecord::Migration
  def change
    add_column :tsessions, :borrowed, :integer
  end
end
