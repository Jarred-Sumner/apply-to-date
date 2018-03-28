import request from "superagent";
import superagentJsonapify from "superagent-jsonapify";
import qs from "qs";

superagentJsonapify(request);

export const BASE_HOSTNAME = process.env.BASE_HOSTNAME;

export const buildUrl = path => `${BASE_HOSTNAME}${path}`;
const get = (path, options = {}) =>
  request.get(buildUrl(path), options).withCredentials();
const post = (path, options = {}) =>
  request.post(buildUrl(path), options).withCredentials();
const put = (path, options = {}) =>
  request.put(buildUrl(path), options).withCredentials();

export const withCookies = (req, request) => {
  if (typeof req !== "undefined") {
    return request.set("Cookie", req.header.cookie);
  } else {
    return request;
  }
};

export const getNotifications = (options = {}) => {
  return get("/notifications");
};

export const hasReportedProfile = profileId => {
  return get(`/reports/profile/${profileId}`);
};

export const reportProfile = profileId => {
  return post(`/reports/profile/${profileId}`);
};

export const markAllNotificationsAsRead = () => {
  return post(`/notifications/read_all`);
};

export const markNotificationAsRead = notificationId => {
  return put(`/notifications/${notificationId}`).send({
    status: "read"
  });
};

export const getCurrentUser = (options = {}) => {
  return get("/users/me", options);
};

export const getProfile = id => {
  return post("/profiles/get").send({ id });
};

export const getNewMatchmake = ({ exclude }) => {
  return post("/matchmakes/new").send({ exclude });
};

export const getFeed = ({
  provider,
  profileId,
  applicationId,
  dateEventApplicationId
}) => {
  return get(`/feeds/${provider}`).query({
    profile_id: profileId,
    application_id: applicationId,
    date_event_application_id: dateEventApplicationId
  });
};

export const createMatch = ({
  exclude,
  left_profile_id,
  right_profile_id,
  rating
}) => {
  return post("/matchmakes").send({
    left_profile_id,
    right_profile_id,
    rating
  });
};

export const shuffleProfile = (opts = {}) => {
  return post("/profiles/shuffle").send(opts);
};

export const updateProfile = profileObject => {
  const { id, ...profile } = profileObject;
  return put("/profiles").send({
    id,
    profile
  });
};

export const getFeaturedProfiles = () => {
  return get("/profiles");
};

export const getVerification = id => {
  return get("/verifications/" + id);
};

export const createAccount = details => {
  return post("/users", {
    ...details
  });
};

export const verifyAccount = ({
  provider,
  token,
  expiration,
  application_email,
  profile_id
}) => {
  return post(`/verifications/${provider}`, {
    application_email,
    access_token: token,
    profile_id,
    expiration
  });
};

export const updateApplication = ({
  email,
  name,
  photos,
  socialLinks,
  tagline,
  phone,
  externalAuthentications,
  recommendedContactMethod,
  sex,
  sections,
  status,
  profileId
}) => {
  return post(`/profiles/${profileId}/apply`, {
    application: {
      email,
      name,
      photos,
      sex,
      phone,
      tagline,
      status,
      external_authentications: externalAuthentications,
      recommended_contact_method: recommendedContactMethod,
      sections,
      social_links: socialLinks,
      status
    }
  });
};

export const updateExistingApplication = ({
  email,
  photos,
  socialLinks,
  id,
  sections
}) => {
  return put(`/applications/${id}`, {
    application: {
      email,
      photos,
      social_links: socialLinks,
      sections
    }
  });
};

export const getSavedApplication = id => {
  return get(`/applications/${id}`);
};

export const getVerifications = () => {
  return get(`/verifications`);
};

export const rateDateEventApplication = (
  dateEventId,
  applicationId,
  approvalStatus
) => {
  return post(`/date_events/${dateEventId}/rate/${applicationId}`, {
    approval_status: approvalStatus
  });
};

export const swapDate = (dateEventId, applicationId, category) => {
  return post(`/date_events/${dateEventId}/rate/${applicationId}`, {
    approval_status: "swap_date",
    category
  });
};

export const getDateEvents = ({ region, id }) => {
  const query = qs.stringify({ id, region }, { arrayFormat: "brackets" });
  return get(`/date_events?${query}`);
};

export const getDateEvent = id => {
  return get(`/date_events/${id}`);
};

export const getDateEventApplication = id => {
  return get(`/date_event_applications/${id}`);
};

export const updateDateEventApplication = ({
  id,
  sections,
  photos,
  socialLinks,
  externalAuthentications
}) => {
  return put(`/date_event_applications/${id}`, {
    sections,
    photos,
    social_links: socialLinks,
    external_authentications: externalAuthentications
  });
};

export const updateRSVPForDateEventApplication = ({
  id,
  confirmationStatus
}) => {
  return put(`/date_event_applications/${id}`, {
    confirmation_status: confirmationStatus
  });
};

export const getAppliedDateEvents = date_event_ids => {
  return get(
    `/date_event_applications?${qs.stringify(
      { date_event_ids },
      { arrayFormat: "brackets" }
    )}`
  );
};

export const getApplicationsForDateEvent = dateEventId =>
  get(`/date_events/${dateEventId}/applications`);

export const getPendingDateApplications = () => {
  return get(`/date_event_applications`);
};

export const getPendingDateEvents = () => {
  return getPendingDateApplications().then(response => {
    const dateEventIDs = response.body.data.map(
      ({ dateEventId }) => dateEventId
    );
    var responseBody = response.body;
    return getDateEvents({ id: dateEventIDs }).then(dateEventsResponse => {
      return {
        body: {
          data: [...responseBody.data, ...dateEventsResponse.body.data],
          included: [
            ...(responseBody.included || []),
            ...(dateEventsResponse.body.included || [])
          ]
        }
      };
    });
  });
};

export const createDateEventApplication = ({
  dateEventId,
  profileId,
  name,
  email,
  phone,
  sections,
  sex,
  status,
  externalAuthentications
}) => {
  return post(`/date_event_applications`, {
    profile_id: profileId,
    date_event_id: dateEventId,
    name,
    email,
    phone,
    sections,
    sex,
    status,
    external_authentications: externalAuthentications
  });
};

export const createDateEvent = ({
  occursOnDay,
  category,
  summary,
  location,
  region
}) => {
  return post(`/date_events`, {
    date_event: {
      occurs_on_day: occursOnDay,
      summary,
      region,
      category,
      location
    }
  });
};

export const updateDateEvent = ({
  occursOnDay,
  category,
  summary,
  location,
  id
}) => {
  return put(`/date_events/${id}`, {
    occurs_on_day: occursOnDay,
    summary,
    category,
    location
  });
};

export const hideDateEvent = id => {
  return put(`/date_events/${id}`, {
    status: "hidden"
  });
};

export const login = session => {
  return post(`/sessions`, {
    session
  });
};

export const updateDevice = ({ pushEnabled, onesignalUid }) => {
  return post(`/devices`, {
    push_enabled: pushEnabled,
    onesignal_uid: onesignalUid
  });
};

export const resetPassword = (token, password) => {
  return post(`/reset-password/${token}`, {
    password
  });
};

export const forgotPassword = username => {
  return post(`/forgot-password`, {
    username
  });
};

export const getReviewApplications = options => {
  return get(`/ratings`, {
    ...options
  });
};

export const getReviewApplication = id => {
  return get(`/ratings/${id}`);
};

export const incrementProfileViewCount = id => {
  return post(`/zzz`, { profile_id: id });
};

export const rateApplication = (id, status) => {
  return put(`/ratings/${id}`, { status });
};

export const getDateEventBySlug = ({ profileId, slug }) => {
  return post(`/date_events/slug`).send({
    profile_id: profileId,
    slug
  });
};

export const getApplication = ({ profileId }) => {
  return post(`/profile/application`).send({
    profile_id: profileId
  });
};

export const getApplications = () => get("/applications");
export const getPendingApplicationsCount = () =>
  get("/applications").query({
    count_only: true
  });
