class MakeResourcesOptionalOnComments < ActiveRecord::Migration[8.0]
  def change
    change_column_null :comments, :resource_type, true
    change_column_null :comments, :resource_id, true
  end
end
