class BackfillNames < ActiveRecord::Migration[5.1]
  def change
    Profile
      .where(name: nil)
      .includes(:external_authentications).where.not(external_authentications: {name: nil })
      .find_each do |profile|
        profile.name = profile.external_authentications.to_a.find { |ext| ext.name.present? }.try(:name)
        profile.save(touch: false)
        Rails.logger.info "Backfill name for: #{profile.id} #{profile.name}"
        puts "Backfill name for: #{profile.id} #{profile.name}"
      end
  end
end
