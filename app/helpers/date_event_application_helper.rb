module DateEventApplicationHelper
  CATEGORY_LABELS = {
    dine: "Dinner",
    drinks: "Drinks",
    brunch: "Brunch",
    lunch: "Lunch",
    formal: "Formal",
    movie: "Movie",
    comedy_show: "Comedy show",
    concert: "Concert",
    coffee: "Coffee",
    fitness: "Work out",
    custom: ""
  }.with_indifferent_access

  EMOJI_BY_CATEGORY = {
    dine: "🍽",
    lunch: "🍱",
    formal: "💃",
    movie: "🎥",
    comedy_show: "🎭",
    concert: "🎸",
    coffee: "☕️",
    fitness: "💪",
    drinks: "🍸",
    brunch: "🍳",
    custom: ""
  }.with_indifferent_access


  def category_label(date_event_application)
    CATEGORY_LABELS[date_event_application.date_event.category].downcase
  end

  def emoji_label(date_event_application)
    EMOJI_BY_CATEGORY[date_event_application.date_event.category].downcase
  end

  def format_date_event_time(date_event_application)
    DateEventApplicationHelper.format_date_event_time(date_event_application.date_event.occurs_on_day, date_event_application.date_event.time_zone)
  end

  def self.format_date_event_time(datetime, zone)
    today = zone.now.beginning_of_day

    if datetime.beginning_of_day == today
      "Today".downcase
    elsif datetime.between?(today, today + 6.days)
      datetime.strftime("on %A").downcase
    elsif datetime.between?(today - 6.days, today)
      datetime.strftime("last %A").downcase
    else
      datetime.strftime("on %b %e").downcase
    end
  end
end
