import { withRouter } from "next/router";

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
          isActive={[href, ...additionalMatches].includes(
            window.location.pathname
          )}
          href={href}
          onClick={handleClick}
          {...otherProps}
        />
      );
    }
  );

export default ActiveLink;
