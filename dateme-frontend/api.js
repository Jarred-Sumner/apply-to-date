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

export const getCurrentUser = () => {
  return get("/users/me");
};

export const getProfile = profile => {
  return get("/profiles/" + profile);
};

export const getFeaturedProfiles = () => {
  return get("/profiles");
};
