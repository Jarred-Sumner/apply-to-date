export const applyMobileCookie = () => {
  if (process.env.NODE_ENV === "production") {
    document.cookie =
      "has_app_installed = true; path=/;max-age=31536000; domain=.applytodate.com";
  } else {
    document.cookie = "has_app_installed = true; path=/;max-age=31536000;";
  }
};

export const hasMobileAppInstalled = () => {
  if (typeof document !== "undefined") {
    return document.cookie.includes("has_app_installed");
  } else {
    return false;
  }
};

export default applyMobileCookie;
