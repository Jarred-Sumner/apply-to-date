import classNames from "classnames";

import TwitterWhiteIcon from "../static/Icon/icons/twitter-white.svg";
import TwitterBlueIcon from "../static/Icon/icons/twitter-blue.svg";

import FacebookWhiteIcon from "../static/Icon/icons/facebook-white.svg";

import PhoneWhiteIcon from "../static/Icon/icons/phone-white.svg";

import InstagramWhiteIcon from "../static/Icon/icons/instagram-white.svg";

import EmailIcon from "../static/Icon/input_field_icons/email.svg";
import HeartIcon from "../static/Icon/input_field_icons/heart.svg";

import XIcon from "../static/Icon/icons/x.svg";
import CheckIcon from "../static/Icon/icons/check.svg";
import FeedbackIcon from "../static/Icon/icons/feedback.svg";
import CaretIcon from "../static/Icon/icons/caret.svg";
import RightCaretIcon from "../static/Icon/icons/caret-right.svg";
import SwitchOnIcon from "../static/Icon/icons/switch-on.svg";
import SwitchOffIcon from "../static/Icon/icons/switch-off.svg";
import PendingVerifyIcon from "../static/Icon/icons/pending-verify.svg";
import Hamburger from "../static/Icon/icons/hamburger.svg";
import Divider from "../static/Icon/icons/divider.svg";
import Matchmake from "../static/Icon/icons/matchmake.svg";
import Link from "../static/Icon/icons/link.svg";
import Shuffle from "../static/Icon/icons/shuffle.svg";
import User from "../static/Icon/icons/user.svg";
import Retweet from "../static/Icon/icons/retweet.svg";
import LocationIcon from "../static/Icon/icons/location.svg";
import EditIcon from "../static/Icon/icons/edit.svg";
import DateIcon from "../static/Icon/icons/date.svg";

import ThumbsUp from "../static/Icon/icons/thumbs-up.svg";
import ThumbsDown from "../static/Icon/icons/thumbs-down.svg";
import IDK from "../static/Icon/icons/idk.svg";
import SocialIcon from "./SocialIcon";
import { defaultProps } from "recompose";

const ICON_COMPONENT_BY_TYPE = {
  retweet: Retweet,
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
  divider: Divider,
  "caret-right": RightCaretIcon,
  "switch-on": SwitchOnIcon,
  "switch-off": SwitchOffIcon,
  "pending-verify": PendingVerifyIcon,
  shuffle: Shuffle,
  matchmake: Matchmake,
  user: User,
  link: Link,
  location: LocationIcon,
  edit: EditIcon,
  date: DateIcon,
  linkedin: defaultProps({ provider: "linkedin" })(SocialIcon),
  "thumbs-up": ThumbsUp,
  "thumbs-down": ThumbsDown,
  idk: IDK
};

export default ({
  type,
  color = "#ffffff",
  size = "18px",
  width,
  inline = false,
  rotate,
  height
}) => {
  let Component = ICON_COMPONENT_BY_TYPE[type];

  return (
    <div className="IconContainer">
      <Component width={width || size} height={height || size} />
      <style jsx>{`
        .IconContainer {
          align-items: center;
          display: ${typeof inline !== "undefined" && inline
            ? "inline-flex"
            : "flex"};
          flex: 0;
          justify-content: center;
          ${rotate && `transform: rotate(${rotate});`};
        }

        .IconContainer :global(.SVGStroke) {
          stroke: ${typeof color !== "undefined"
            ? color
            : "#ffffff"} !important;
        }

        .IconContainer :global(.SVGFill) {
          fill: ${typeof color !== "undefined" ? color : "#ffffff"} !important;
        }
      `}</style>
    </div>
  );
};
