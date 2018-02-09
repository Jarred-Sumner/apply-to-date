import SocialLoginButtonHOC from "react-social-login";

export const SUPPORTED_PROVIDERS = ["facebook", "instagram"];

export const PROPS_FOR_PROVIDER = {
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    scopes: process.env.FACEBOOK_SCOPES
  },
  instagram: {
    appId: process.env.INSTAGRAM_CLIENT_ID,
    scopes: process.env.INSTAGRAM_SCOPES
  }
};

export default SocialLoginButtonHOC;
