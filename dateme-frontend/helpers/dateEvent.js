import { isApplicationPickable } from "../redux/store";
import geolib from "geolib";

export const CATEGORIES = {
  dine: "dine",
  lunch: "lunch",
  formal: "formal",
  movie: "movie",
  comedy_show: "comedy_show",
  concert: "concert",
  coffee: "coffee",
  fitness: "fitness",
  brunch: "brunch",
  drinks: "drinks",
  custom: "custom"
};

export const PUBLIC_CATEGORIES = _.fromPairs(
  _.values(CATEGORIES)
    .filter(category => category !== CATEGORIES.custom)
    .map(category => [category, category])
);

export const EMOJI_BY_CATEGORY = {
  [CATEGORIES.dine]: "🍽",
  [CATEGORIES.lunch]: "🍱",
  [CATEGORIES.formal]: "💃",
  [CATEGORIES.movie]: "🎥",
  [CATEGORIES.comedy_show]: "🎭",
  [CATEGORIES.concert]: "🎸",
  [CATEGORIES.coffee]: "☕️",
  [CATEGORIES.fitness]: "💪",
  [CATEGORIES.drinks]: "🍸",
  [CATEGORIES.brunch]: "🍳",
  [CATEGORIES.custom]: ""
};

export const LABELS_BY_CATEGORY = {
  [CATEGORIES.dine]: "Dinner",
  [CATEGORIES.drinks]: "Drinks",
  [CATEGORIES.brunch]: "Brunch",
  [CATEGORIES.lunch]: "Lunch",
  [CATEGORIES.formal]: "Formal",
  [CATEGORIES.movie]: "Movie",
  [CATEGORIES.comedy_show]: "Comedy show",
  [CATEGORIES.concert]: "Concert",
  [CATEGORIES.coffee]: "Coffee",
  [CATEGORIES.fitness]: "Work out",
  [CATEGORIES.custom]: ""
};

export const labelWithPrefix = category => {
  if (!category || category === CATEGORIES.custom) {
    return "a date";
  } else if (
    [
      CATEGORIES.dine,
      CATEGORIES.lunch,
      CATEGORIES.coffee,
      CATEGORIES.drinks,
      CATEGORIES.brunch
    ].includes(category)
  ) {
    return `get ${LABELS_BY_CATEGORY[category].toLowerCase()}`;
  } else if ([CATEGORIES.fitness].includes(category)) {
    return LABELS_BY_CATEGORY[category].toLowerCase();
  } else {
    return `a ${LABELS_BY_CATEGORY[category].toLowerCase()}`;
  }
};

export const formatTitle = ({ profile, category }) => {
  const emoji = EMOJI_BY_CATEGORY[category];
  const label = LABELS_BY_CATEGORY[category];

  return `${emoji} ${label} with ${profile.name}`;
};

export const APPLICANT_STATUSES = {
  pending: "PENDING",
  pending_approval: "PENDING_APPROVAL",
  declined: "declined",
  rsvp: "RSVP",
  confirmed: "CONFIRMED",
  closed: "CLOSED"
};

export const CREATOR_STATUSES = {
  new_event: "NEW_EVENT",
  pick_someone: "PICK_SOMEONE",
  single_confirm_rsvp: "SINGLE_CONFIRM_RSVP",
  double_confirm_rsvp: "DOUBLE_CONFIRM_RSVP",
  hidden: "HIDDEN",
  expired: "EXPIRED"
};

export const getApplicantStatus = ({
  dateEvent,
  dateEventApplication,
  dateEventApplications = [],
  currentProfile,
  profile
}) => {
  if (isOwnedByCurrentUser({ dateEvent, currentProfile })) {
    return null;
  }

  if (
    dateEvent.status === "scheduled" &&
    dateEventApplication &&
    dateEventApplication.confirmationStatus === "pending_confirmation" &&
    dateEventApplication.approvalStatus === "approved"
  ) {
    return APPLICANT_STATUSES.rsvp;
  } else if (
    dateEvent.status === "chose_applicant" &&
    dateEventApplication &&
    dateEventApplication.confirmationStatus === "confirmed" &&
    dateEventApplication.approvalStatus === "approved"
  ) {
    return APPLICANT_STATUSES.confirmed;
  } else if (
    !["expired", "hidden"].includes(dateEvent.status) &&
    dateEventApplication &&
    dateEventApplication.approvalStatus === "approved" &&
    dateEventApplication.confirmationStatus === "declined"
  ) {
    return APPLICANT_STATUSES.declined;
  } else if (
    !["expired", "hidden"].includes(dateEvent.status) &&
    dateEventApplication &&
    ["pending", "submitted"].includes(dateEventApplication.approvalStatus) &&
    dateEventApplication.confirmationStatus === "pending_confirmation"
  ) {
    return APPLICANT_STATUSES.pending_approval;
  } else if (
    !["expired", "hidden", "chose_applicant"].includes(dateEvent.status)
  ) {
    return APPLICANT_STATUSES.pending;
  } else {
    return APPLICANT_STATUSES.closed;
  }
};

export const getCreatorStatus = ({
  dateEvent,
  dateEventApplication,
  dateEventApplications = [],
  currentProfile,
  profile
}) => {
  if (!isOwnedByCurrentUser({ dateEvent, currentProfile })) {
    return null;
  }

  if (
    ["scheduled", "chose_applicant"].includes(dateEvent.status) &&
    (!dateEventApplication ||
      dateEventApplication.confirmationStatus === "rejected")
  ) {
    const applicationsCount = dateEventApplications.filter(
      isApplicationPickable
    ).length;

    return applicationsCount === 0
      ? CREATOR_STATUSES.new_event
      : CREATOR_STATUSES.pick_someone;
  } else if (dateEvent.status === "hidden") {
    return CREATOR_STATUSES.hidden;
  } else if (dateEvent.status === "expired") {
    return CREATOR_STATUSES.expired;
  } else if (
    dateEventApplication.approvalStatus === "approved" &&
    dateEventApplication.confirmationStatus === "pending_confirmation"
  ) {
    return CREATOR_STATUSES.single_confirm_rsvp;
  } else if (
    dateEventApplication.approvalStatus === "approved" &&
    dateEventApplication.confirmationStatus === "confirmed"
  ) {
    return CREATOR_STATUSES.double_confirm_rsvp;
  } else {
    return null;
  }
};

export const REGIONS = {
  bay_area: "bay_area"
  // boston: "boston",
  // new_york: "new_york"
};

export const REGION_LABELS = {
  bay_area: "Bay Area",
  boston: "Boston",
  new_york: "New York"
};

export const LOCATIONS_FOR_REGION = {
  [REGIONS.bay_area]: {
    SF: [[37.76071, -122.438853]],
    "East Bay": [
      [37.821792, -122.315299],
      [37.701252, -122.177086],
      [37.608329, -122.091525],
      [37.501366, -122.003771]
    ],
    "South Bay": [
      [37.432586, -122.071781],
      [37.48483, -122.169407],
      [37.562258, -122.252774],
      [37.633525, -122.449124]
    ]
  }
  // [REGIONS.new_york]: ["Manhattan", "Brooklyn"],
  // [REGIONS.boston]: ["Cambridge", "Back bay"]
};

export const LOCATION_LABEL_MAPPING = {
  SF: "San Francisco",
  "East Bay": "East Bay",
  "South Bay": "South Bay",
  Manhattan: "Manhattan",
  Brooklyn: "Brooklyn"
};

export const getDefaultLocation = ({ locations, latitude, longitude }) => {
  if (!latitude || !longitude) {
    return null;
  }

  const distances = _.keys(locations).map(key => {
    return {
      key,
      distance: _.min(
        locations[key].map(coords =>
          geolib.getDistance(
            {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude)
            },
            { latitude: coords[0], longitude: coords[1] }
          )
        )
      )
    };
  });

  return _.first(_.orderBy(distances, "distance", "asc")).key;
};

export const isOwnedByCurrentUser = ({ dateEvent, currentProfile }) => {
  if (!currentProfile || !dateEvent) {
    return false;
  } else {
    return (
      String((dateEvent || {}).profileId) === String((currentProfile || {}).id)
    );
  }
};

export const isDatesEnabled = profile => {
  return profile && profile.region === REGIONS.bay_area;
};

export const APPLICATION_STATUSES = {
  pending: "PENDING",
  single_confirm_rsvp: "SINGLE_CONFIRM_RSVP",
  double_confirm_rsvp: "DOUBLE_CONFIRM_RSVP",
  declined: "DECLINED",
  swap_date: "SWAP_DATE"
};

export const getApplicationStatus = dateEventApplication => {
  if (
    dateEventApplication.approvalStatus === "approved" &&
    dateEventApplication.confirmationStatus === "pending_confirmation"
  ) {
    return APPLICATION_STATUSES.single_confirm_rsvp;
  } else if (
    dateEventApplication.approvalStatus === "approved" &&
    dateEventApplication.confirmationStatus === "confirmed"
  ) {
    return APPLICATION_STATUSES.double_confirm_rsvp;
  } else if (
    dateEventApplication.approvalStatus === "approved" &&
    dateEventApplication.confirmationStatus === "declined"
  ) {
    return APPLICATION_STATUSES.declined;
  } else if (dateEventApplication.approvalStatus === "swap_date") {
    return APPLICATION_STATUSES.swap_date;
  } else {
    return APPLICATION_STATUSES.pending;
  }
};
