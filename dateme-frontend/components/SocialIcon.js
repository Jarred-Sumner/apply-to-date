import Icons from "./SocialIcon/icons";

export const getComponent = ({ provider, active }) => {
  const providerIcons = Icons[provider];

  if (active) {
    return providerIcons.active;
  } else {
    return providerIcons.disabled;
  }
};

export default ({ provider, active }) => {
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

  return <Component />;
};
