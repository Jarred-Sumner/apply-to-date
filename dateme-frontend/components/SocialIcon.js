import Icons from "./SocialIcon/icons";
import invariant from "invariant";

export const getComponent = ({ provider, active }) => {
  const providerIcons = Icons[provider];

  invariant(providerIcons, `Missing icon for ${provider}`);

  if (active) {
    return providerIcons.active;
  } else {
    return providerIcons.disabled;
  }
};

export default ({ provider, active, width = "100%", height = "100%" }) => {
  if (provider === "snapchat" && !active) {
    return (
      <img
        src="/static/Icon/social/Disabled/Snapchat.png"
        width="18px"
        height="18px"
      />
    );
  }

  const Component = getComponent({ provider, active });

  if (!Component) {
    return null;
  }

  return <Component width={width} height={height} />;
};
