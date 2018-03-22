module ApplicationHelper

  def profile_url(profile)
    raw Api::V1::ApplicationController.build_frontend_uri("/#{profile.id}", {})
  end

  def pretext(string)
    content_for :pretext do
      (string + " " * 100)[0, 100]
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

  def section_label(section)
    {
      "why" => "Why",
      "introduction" => "Introduction"
    }.with_indifferent_access[section]
  end
end
