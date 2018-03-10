export const applyMobileCookie = () => {
  if (process.env.NODE_ENV === "production") {
    document.cookie =
      "has_app_installed = true; path=/;max-age=31536000; domain=.applytodate.com";
  } else {
    document.cookie = "has_app_installed = true; path=/;max-age=31536000;";
  }
};

export default applyMobileCookie;
