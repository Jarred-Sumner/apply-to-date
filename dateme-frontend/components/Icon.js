import classNames from "classnames";

import TwitterWhiteIcon from "../static/Icon/icons/twitter-white.svg";
import TwitterBlueIcon from "../static/Icon/icons/twitter-blue.svg";

import FacebookWhiteIcon from "../static/Icon/icons/facebook-white.svg";

import InstagramWhiteIcon from "../static/Icon/icons/instagram-white.svg";

import XIcon from "../static/Icon/icons/x.svg";
import CheckIcon from "../static/Icon/icons/Check.svg";

const ICON_COMPONENT_BY_TYPE = {
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

export default ({ type, color }) => {
  let Component = ICON_COMPONENT_BY_TYPE[type];
  if (color && Component[color]) {
    Component = Component[color];
  }

  return (
    <div className={classNames("Icon", `Icon--${type}`)}>
      <Component />
      <style jsx>{`
        .Icon {
          display: inline-flex;
        }
      `}</style>
    </div>
  );
};
