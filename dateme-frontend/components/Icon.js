import classNames from "classnames";

import TwitterIcon from "../static/Icon/icons/twitter.svg";
import XIcon from "../static/Icon/icons/x.svg";
import CheckIcon from "../static/Icon/icons/Check.svg";

const ICON_COMPONENT_BY_TYPE = {
  twitter: TwitterIcon,
  x: XIcon,
  check: CheckIcon
};

export default ({ type }) => {
  const Component = ICON_COMPONENT_BY_TYPE[type];
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
