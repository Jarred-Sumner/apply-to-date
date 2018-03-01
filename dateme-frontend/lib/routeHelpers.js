import { Router } from "../routes";
import qs from "qs";

export const buildProfileURL = profileId => {
  return encodeURI(process.env.DOMAIN + "/" + profileId);
};

export const buildApplyURL = profileId => {
  return encodeURI(process.env.DOMAIN + "/" + profileId + "/apply");
};

export const buildApplicantApplicationURL = applicationId => {
  return encodeURI(process.env.DOMAIN + "/a/" + applicationId);
};

export const buildProfileShareURL = profileId => {
  return encodeURI(process.env.SHARE_DOMAIN + "/" + profileId);
};

export const buildEditProfileURL = profileId => {
  return encodeURI(process.env.DOMAIN + "/" + profileId + "/edit");
};

export const buildShufflePath = () => "/shuffle";
export const buildMatchmakePath = () => "/matchmake";

export const updateQuery = (url, params) => {
  const urlParams = {
    ...url.query,
    ...params
  };

  const newUrl = `${url.asPath.split("?")[0]}?${qs.stringify(urlParams)}`.split(
    "#_=_"
  )[0];

  console.log("Replacing", newUrl);

  return Router.replaceRoute(newUrl, newUrl, {
    shallow: true
  });
};
