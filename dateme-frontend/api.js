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

export const saveApplication = ({
  email,
  name,
  photos,
  socialLinks,
  tagline,
  externalAuthentications,
  sections,
  profileId
}) => {
  return post(`/profiles/${profileId}/apply`, {
    application: {
      email,
      name,
      photos,
      tagline,
      external_authentications: externalAuthentications,
      sections,
      social_links: socialLinks,
      status: "pending"
    }
  });
};

export const getSavedApplication = id => {
  return get(`/applications/${id}`);
};

export const getVerifications = () => {
  return get(`/verifications`);
};

export const submitApplication = ({
  email,
  name,
  photos,
  socialLinks,
  tagline,
  externalAuthentications,
  sections,
  profileId
}) => {
  return post(`/profiles/${profileId}/apply`, {
    application: {
      email,
      name,
      photos,
      tagline,
      external_authentications: externalAuthentications,
      sections,
      social_links: socialLinks,
      status: "submitted"
    }
  });
};
