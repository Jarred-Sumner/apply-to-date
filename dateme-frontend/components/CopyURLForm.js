import Alert from "./Alert";
import InlineTextForm from "./InlineTextForm";
import copy from "copy-to-clipboard";
import { logEvent } from "../lib/analytics";

export default ({ url, ...otherProps }) => (
  <InlineTextForm
    {...otherProps}
    type="url"
    value={url}
    readOnly
    onSubmit={() => {
      copy(url);
      logEvent("Copy URL", {
        url
      });
      Alert.success("Copied.");
    }}
    buttonChildren={"Copy Link"}
  />
);
