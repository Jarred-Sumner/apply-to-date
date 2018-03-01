import Alert from "./Alert";
import InlineTextForm from "./InlineTextForm";
import Icon from "./Icon";
import copy from "copy-to-clipboard";
import { logEvent } from "../lib/analytics";

export default ({
  url,
  size = "normal",
  icon = <Icon type="link" size="14px" color="#BABABA" />,
  buttonChildren = "Copy Link",
  buttonFill = true,
  ...otherProps
}) => (
  <InlineTextForm
    {...otherProps}
    type="url"
    value={url}
    size={size}
    readOnly
    icon={icon}
    onSubmit={() => {
      copy(url);
      logEvent("Copy URL", {
        url
      });
      Alert.success("Copied.");
    }}
    buttonFill={buttonFill}
    buttonChildren={buttonChildren}
  />
);
