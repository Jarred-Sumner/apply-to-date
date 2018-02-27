import { withRouter } from "next/router";

const getPathname = href => {
  if (href.startsWith("http")) {
    return new URL(href).pathname;
  } else {
    return href;
  }
};

const isActive = router => href => {
  const pathname = getPathname(href);
  const currentPath = router.asPath.split("?")[0];

  return pathname === currentPath;
};

const ActiveLink = Component =>
  withRouter(
    ({ router, additionalMatches = [], href, onClick, ...otherProps }) => {
      const handleClick = e => {
        e.preventDefault();

        if (onClick) {
          onClick(e);
        }
        router.push(href);
      };

      return (
        <Component
          isActive={!![href, ...additionalMatches].find(isActive(router))}
          href={href}
          onClick={handleClick}
          {...otherProps}
        />
      );
    }
  );

export default ActiveLink;
