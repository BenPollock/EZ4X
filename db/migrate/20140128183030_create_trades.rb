class CreateTrades < ActiveRecord::Migration
  def change
    create_table :trades do |t|
      t.integer :quote_id
      t.integer :units

      t.timestamps
    end
  end
end
