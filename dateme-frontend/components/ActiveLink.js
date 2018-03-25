import { withRouter } from "next/router";
import { Router } from "../routes";
import URL from "url-parse";

const getPathname = href => {
  if (href.startsWith("http")) {
    return new URL(href).pathname;
  } else {
    return href;
  }
};

const isActive = router => href => {
  const pathname = getPathname(href);
  const currentPath = getPathname(router.asPath.split("?")[0]);
  return pathname === currentPath;
};

const isRegexActive = router => regex => {
  const currentPath = getPathname(router.asPath.split("?")[0]);
  return regex.test(currentPath);
};

const ActiveLink = Component =>
  withRouter(
    ({
      router,
      additionalMatches = [],
      href,
      prefetch,
      onClick,
      ...otherProps
    }) => {
      const handleClick = e => {
        e.preventDefault();

        if (onClick) {
          onClick(e);
        }
        Router.pushRoute(href);
      };

      if (prefetch && typeof window !== "undefined") {
        Router.prefetchRoute(href);
      }

      return (
        <Component
          isActive={
            isActive(router)(href) ||
            additionalMatches.find(isRegexActive(router))
          }
          href={href}
          onClick={handleClick}
          {...otherProps}
        />
      );
    }
  );

export default ActiveLink;
