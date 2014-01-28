class CreatePositions < ActiveRecord::Migration
  def change
    create_table :positions do |t|
      t.integer :session_id
      t.string :currency
      t.decimal :value
      t.integer :units

      t.timestamps
    end
  end
end
