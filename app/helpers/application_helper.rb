module ApplicationHelper

  SECTION_LABELS = {
    "why" => "Why",
    "background" => "Background",
    "looking-for" => "Looking for",
    "not-looking-for" => "Not looking for",
    "introduction" => "Introduction"
  }.with_indifferent_access

  def him_her_them(sex)
    if String(sex).downcase == 'male'
      'him'
    elsif String(sex).downcase == 'female'
      'her'
    else
      'them'
    end
  end

  def profile_url(profile)
    raw Api::V1::ApplicationController.build_frontend_uri("/#{profile.id}", {})
  end

  def pretext(string)
    content_for :pretext do
      string[0..199]
    end
  end

  def profile_name(profile)
    profile.name.titleize
  end

  def short_profile_name(profile)
    profile_name(profile).split(" ").first
  end

  def people_list(profiles, voted_on)
    "#{profile_name(profiles.sample)} and #{pluralize(profiles.count - 1, "other person", "other people")} voted that you and #{short_profile_name(voted_on)} could make a great couple!"
  end

  SECTION_ORDERING = [
    'why',
    'introduction',
    'background',
  ]

  def section_key(sections)
    sections
      .keys
      .map(&:to_s)
      .select { |key| SECTION_ORDERING.include?(key) }
      .sort_by { |key| SECTION_ORDERING.index(key) }
      .first
  end

  def section_label(application)
    section = section_key(application.sections)
    return nil if section.nil?

    SECTION_LABELS[section]
  end

  def section_value(application)
    section = section_key(application.sections)
    return nil if section.nil?

    application.sections[String(section)]
  end
end
