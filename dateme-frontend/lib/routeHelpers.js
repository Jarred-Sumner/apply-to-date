export const buildProfileURL = profileId => {
  return encodeURI(process.env.DOMAIN + "/" + profileId);
};

export const buildProfileShareURL = profileId => {
  return encodeURI(process.env.SHARE_DOMAIN + "/" + profileId);
};

export const buildEditProfileURL = profileId => {
  return encodeURI(process.env.DOMAIN + "/" + profileId + "/edit");
};
