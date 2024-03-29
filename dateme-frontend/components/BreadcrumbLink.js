import Text from "./Text";
import ActiveLink from "./ActiveLink";
import classNames from "classnames";
import {Link} from "../routes";

const BreadcrumbLink = ({ href, children, isActive, onClick }) => {
  return (
    <a
      onClick={onClick}
      href={href}
      className={classNames("BreadcrumbLink", {
        "BreadcrumbLink--active": isActive,
        "BreadcrumbLink--inactive": !isActive
      })}
    >
      <Text
        casing="uppercase"
        color="#343E5C"
        size="14px"
        weight="bold"
        lineHeight="18px"
      >
        {children}
      </Text>
      <style jsx>{`
        .BreadcrumbLink {
          display: inline-block;
          transition: opacity 0.1s linear;
        }

        .BreadcrumbLink--inactive:hover,
        .BreadcrumbLink--active {
          opacity: 1;
        }

        .BreadcrumbLink--active {
          border-bottom: 1.5px solid #b9bed1;
        }

        .BreadcrumbLink--inactive {
          border-bottom: 1.5px solid transparent;
          opacity: 0.62;
        }
      `}</style>
    </a>
  );
};

export default ActiveLink(BreadcrumbLink);
