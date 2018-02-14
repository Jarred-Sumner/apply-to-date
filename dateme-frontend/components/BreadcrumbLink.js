import Text from "./Text";
import ActiveLink from "./ActiveLink";
import classNames from "classnames";

const BreadcrumbLink = ({ href, children, isActive }) => {
  return (
    <a
      href={href}
      className={classNames("BreadcrumbLink", {
        "BreadcrumbLink--active": isActive
      })}
    >
      <style jsx>{`
        .BreadcrumbLink {
        }
      `}</style>
    </a>
  );
};

export default ActiveLink(BreadcrumbLink);
