import SocialLoginButtonHOC from "react-social-login";

export const BASE_AUTHORIZE_URL = process.env.BASE_AUTHORIZE_URL;
export const SUPPORTED_PROVIDERS = [
  "facebook",
  "instagram",
  "twitter",
  "linkedin"
];

export default SocialLoginButtonHOC;
