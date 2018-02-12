import MobileDetect from "mobile-detect";

var mobileDetect;

const getMobileDetect = () => {
  if (typeof window !== "undefined") {
    if (!mobileDetect) {
      mobileDetect = new MobileDetect(window.navigator.userAgent, 600);
    }
  }

  return mobileDetect;
};

export const isMobile = () => {
  const mobileDetect = getMobileDetect();

  return mobileDetect && mobileDetect.mobile();
};

export default getMobileDetect;
