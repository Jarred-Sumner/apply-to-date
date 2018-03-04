class CreateReports < ActiveRecord::Migration[5.1]
  def change
    create_table :reports do |t|
      t.references :user, foreign_key: true, index: true, type: :uuid
      t.references :reportable, foreign_key: false, index: true, type: :string, polymorphic: true

      t.timestamps
    end
  end
end
