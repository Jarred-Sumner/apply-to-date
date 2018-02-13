import request from "superagent";
import superagentJsonapify from "superagent-jsonapify";

superagentJsonapify(request);

export const BASE_HOSTNAME = "http://localhost:3001/api/v1";

const buildUrl = path => `${BASE_HOSTNAME}${path}`;
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

export const getCurrentUser = (options = {}) => {
  return get("/users/me", options);
};

export const getProfile = profile => {
  return get("/profiles/" + profile);
};

export const updateProfile = profileObject => {
  const { id, ...profile } = profileObject;
  return put("/profiles/" + id).send({
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

export const login = session => {
  return post(`/sessions`, {
    session
  });
};

export const getReviewApplications = status => {
  return get(`/ratings`, {
    status
  });
};

export const getReviewApplication = id => {
  return get(`/ratings/${id}`);
};

export const rateApplication = (id, status) => {
  return put(`/ratings/${id}`, { status });
};
