import Amplitude from "react-amplitude";
import _ from "lodash";

export const logEvent = (name, props = {}, callback = _.noop) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[amplitude]", name, props);
  }
  Amplitude.logEvent(name, props, callback);
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
