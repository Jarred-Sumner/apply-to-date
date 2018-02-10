import SocialLoginButtonHOC from "react-social-login";

export const BASE_AUTHORIZE_URL = process.env.BASE_AUTHORIZE_URL;
export const SUPPORTED_PROVIDERS = ["facebook", "instagram"];

export const PROPS_FOR_PROVIDER = {
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    scopes: process.env.FACEBOOK_SCOPES
  }
};

export default SocialLoginButtonHOC;
