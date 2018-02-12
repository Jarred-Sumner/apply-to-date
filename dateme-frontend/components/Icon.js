import classNames from "classnames";

import TwitterWhiteIcon from "../static/Icon/icons/twitter-white.svg";
import TwitterBlueIcon from "../static/Icon/icons/twitter-blue.svg";

import FacebookWhiteIcon from "../static/Icon/icons/facebook-white.svg";

import PhoneWhiteIcon from "../static/Icon/icons/phone-white.svg";

import InstagramWhiteIcon from "../static/Icon/icons/instagram-white.svg";

import EmailIcon from "../static/Icon/input_field_icons/email.svg";
import HeartIcon from "../static/Icon/input_field_icons/heart.svg";

import XIcon from "../static/Icon/icons/x.svg";
import CheckIcon from "../static/Icon/icons/Check.svg";
import FeedbackIcon from "../static/Icon/icons/feedback.svg";
import CaretIcon from "../static/Icon/icons/caret.svg";
import RightCaretIcon from "../static/Icon/icons/caret-right.svg";
import SwitchOnIcon from "../static/Icon/icons/switch-on.svg";
import SwitchOffIcon from "../static/Icon/icons/switch-off.svg";
import PendingVerifyIcon from "../static/Icon/icons/pending-verify.svg";
import Hamburger from "../static/Icon/icons/hamburger.svg";

const ICON_COMPONENT_BY_TYPE = {
  email: EmailIcon,
  twitter: TwitterWhiteIcon,
  facebook: FacebookWhiteIcon,
  instagram: InstagramWhiteIcon,
  phone: PhoneWhiteIcon,
  heart: HeartIcon,
  caret: CaretIcon,
  x: XIcon,
  check: CheckIcon,
  feedback: FeedbackIcon,
  "caret-right": RightCaretIcon,
  "switch-on": SwitchOnIcon,
  "switch-off": SwitchOffIcon,
  "pending-verify": PendingVerifyIcon
};

export default ({ type, color = "#ffffff", size = "18px" }) => {
  let Component = ICON_COMPONENT_BY_TYPE[type];

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
