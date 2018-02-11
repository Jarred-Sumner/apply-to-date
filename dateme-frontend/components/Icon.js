import classNames from "classnames";

import TwitterWhiteIcon from "../static/Icon/icons/twitter-white.svg";
import TwitterBlueIcon from "../static/Icon/icons/twitter-blue.svg";

import FacebookWhiteIcon from "../static/Icon/icons/facebook-white.svg";

import InstagramWhiteIcon from "../static/Icon/icons/instagram-white.svg";

import EmailIcon from "../static/Icon/input_field_icons/email.svg";

import XIcon from "../static/Icon/icons/x.svg";
import CheckIcon from "../static/Icon/icons/Check.svg";

const ICON_COMPONENT_BY_TYPE = {
  email: EmailIcon,
  twitter: {
    white: TwitterWhiteIcon,
    blue: TwitterBlueIcon
  },
  facebook: {
    white: FacebookWhiteIcon
  },
  instagram: {
    white: InstagramWhiteIcon
  },
  x: XIcon,
  check: CheckIcon
};

export default ({ type, color = "#ffffff", size = "18px" }) => {
  let Component = ICON_COMPONENT_BY_TYPE[type];
  if (color && Component[color]) {
    Component = Component[color];
  }

  return (
    <div className="IconContainer">
      <Component width={size} height={size} />
      <style jsx>{`
        .IconContainer {
          align-items: center;
          display: flex;
          flex: 0;
          justify-content: center;
        }

        .IconContainer :global(.SVGStroke) {
          stroke: ${color};
        }

        .IconContainer :global(.SVGFill) {
          fill: ${color};
        }
      `}</style>
    </div>
  );
};
