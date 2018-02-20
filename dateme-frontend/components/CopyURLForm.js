import Alert from "./Alert";
import InlineTextForm from "./InlineTextForm";
import copy from "copy-to-clipboard";

export default ({ url, ...otherProps }) => (
  <InlineTextForm
    {...otherProps}
    type="url"
    value={url}
    readOnly
    onSubmit={() => {
      copy(url);
      Alert.success("Copied.");
    }}
    buttonChildren={"Copy Link"}
  />
);
