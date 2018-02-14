import Text from "./Text";
import ActiveLink from "./ActiveLink";
import classNames from "classnames";

const BreadcrumbLink = ({ href, children, isActive }) => {
  return (
    <a
      href={href}
      className={classNames("BreadcrumbLink", {
        "BreadcrumbLink--active": isActive,
        "BreadcrumbLink--inactive": isActive
      })}
    >
      <Text color="#343E5C" size="12px" lineHeight="17px">
        {children}
      </Text>
      <style jsx>{`
        .BreadcrumbLink {
          transition: opacity 0.1s linear;
        }

        .BreadcrumbLink--active {
          opacity: 1;
          border-bottom: 1.5px solid #b9bed1;
        }
        .BreadcrumbLink--inactive {
          border-bottom: 1.5px solid transparent;
          opacity: 0.42;
        }
      `}</style>
    </a>
  );
};

export default ActiveLink(BreadcrumbLink);
