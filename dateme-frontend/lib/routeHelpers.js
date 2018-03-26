import { Router } from "../routes";
const MOBILE_APP_BASE_URI = `applytodate://`;
import qs from "qs";

export const buildProfileURL = profileId => {
  return encodeURI(process.env.DOMAIN + "/" + profileId);
};

export const buildApplyURL = profileId => {
  return encodeURI(process.env.DOMAIN + "/" + profileId + "/apply");
};

export const buildApplicationURL = applicationId => {
  return encodeURI(process.env.DOMAIN + "/applications/" + applicationId);
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

export const buildMobileLoginURL = params => {
  return `${MOBILE_APP_BASE_URI}login?${qs.stringify(params)}`;
};

export const buildMobileEditPagePath = () => {
  return `page/edit`;
};

export const buildMobileViewProfileURL = profileId => {
  return `${MOBILE_APP_BASE_URI}p/${profileId}`;
};

export const buildMobileMatchmakeURL = () => {
  return `${MOBILE_APP_BASE_URI}matchmake`;
};

export const buildMobileShuffleURL = () => {
  return `${MOBILE_APP_BASE_URI}shuffle`;
};

export const buildMobileApplicationsURL = () => {
  return `${MOBILE_APP_BASE_URI}applications`;
};

export const buildMobileApplicationURL = applicationId => {
  return `${MOBILE_APP_BASE_URI}application/${applicationId}`;
};

export const buildMobileEditPageURL = () => {
  return `${MOBILE_APP_BASE_URI}${buildMobileEditPagePath()}`;
};

export const updateQuery = (url, params) => {
  const urlParams = {
    ...url.query,
    ...params
  };

  const newUrl = `${url.asPath.split("?")[0]}?${qs.stringify(urlParams)}`.split(
    "#_=_"
  )[0];

  return Router.replaceRoute(newUrl, newUrl, {
    shallow: true
  });
};

export const buildRouteForNotification = notification => {
  const { notifiableType, notifiableId } = notification;
  if (notifiableType === "Application") {
    return buildApplicationURL(notifiableId);
  } else if (notifiableType === "Profile") {
    return buildProfileURL(notifiableId);
  } else if (notifiableType === "DateEvent") {
    return `/d/${notifiableId}`;
  } else if (notifiableType === "DateEventApplication") {
    return `/de/${notifiableId}`;
  }
};

export const buildDateEventURL = dateEventId => {
  return encodeURI(process.env.SHARE_DOMAIN + "/dates/" + dateEventId);
};

export const buildCreatorDateEventApplicationURL = (
  applicationId,
  dateEventId
) => {
  return encodeURI(
    process.env.SHARE_DOMAIN +
      "/dates/" +
      dateEventId +
      "/pick-someone/" +
      applicationId
  );
};

export const buildPickSomeoneURL = dateEventId => {
  return encodeURI(
    process.env.SHARE_DOMAIN + "/dates/" + dateEventId + "/pick-someone"
  );
};
