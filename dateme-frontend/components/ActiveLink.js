import { withRouter } from "next/router";

const ActiveLink = Component =>
  withRouter(({ router, href, onClick, ...otherProps }) => {
    const handleClick = e => {
      e.preventDefault();

      if (onClick) {
        onClick(e);
      }
      router.push(href);
    };

    return (
      <Component
        isActive={href === router.pathname}
        href={href}
        onClick={handleClick}
        {...otherProps}
      />
    );
  });

export default ActiveLink;
