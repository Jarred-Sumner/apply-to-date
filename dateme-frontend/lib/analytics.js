import Amplitude from "react-amplitude";
import _ from "lodash";
import { isMobile } from "./Mobile";

export const logEvent = (name, props = {}, callback = _.noop) => {
  const params = {
    ...props,
    path: window.location.pathname,
    isMobile: !!isMobile()
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("[amplitude]", name, params);
  }
  Amplitude.logEvent(name, params, callback);
};

export const logEventWithTimestamp = (
  name,
  props = {},
  timestamp,
  callback = _.noop
) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[amplitude]", name, props);
  }

  Amplitude.logEventWithTimestamp(name, props, timestamp, callback);
};
