class RemoveLinkedinContactMethod < ActiveRecord::Migration[5.1]
  def change
    Profile.where.not(recommended_contact_method: [
      'twitter',
      'facebook',
      'instagram',
      'phone'
    ]).update_all(recommended_contact_method: 'phone')
  end
end
