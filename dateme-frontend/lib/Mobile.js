import MobileDetect from "mobile-detect";

var _isMobile;
var mobileDetect;

export const getMobileDetect = userAgent => {
  if (!mobileDetect) {
    mobileDetect = new MobileDetect(userAgent, 600);
  }

  return mobileDetect;
};

export const setIsMobile = isMobile => (_isMobile = isMobile);

export const isMobile = () => {
  if (!_isMobile) {
    const mobileDetect = getMobileDetect();

    _isMobile = mobileDetect && mobileDetect.mobile();
  }

  return !!_isMobile;
};

export default getMobileDetect;
