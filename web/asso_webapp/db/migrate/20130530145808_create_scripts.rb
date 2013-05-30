class CreateScripts < ActiveRecord::Migration
  def change
    create_table :scripts do |t|
      t.references :user
      t.string :title
      t.text :code

      t.timestamps
    end
    add_index :scripts, :user_id
  end
end
