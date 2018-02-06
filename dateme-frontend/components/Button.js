import Link from "next/link";
import classNames from "classnames";

const Button = ({
  onClick,
  pathname,
  query,
  prefetch,
  className,
  children,
  inline,
  size = "normal",
  componentType = "div",
  color = "black",
  icon
}) => {
  const classes = classNames("Button", {
    "Button--iconOnly": !children && !!icon,
    "Button--icon": !!icon,
    "Button--black": color === "black",
    "Button--green": color === "green",
    "Button--gray": color === "gray",
    "Button--large": size === "large",
    "Button--inline": !!inline,
    "Button--normal": size === "normal"
  });

  const component = (
    <span>
      <style jsx>{`
        .Button {
          font-family: Lato, sans-serif;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 700;
          appearance: none;
          text-align: center;
          justify-content: center;
          border: 1px solid transparent;
          align-items: center;
          display: flex;
          border-radius: 33px;
          box-shadow: none;
          color: #ffffff;
          cursor: pointer;
        }

        .Button:hover {
          background-color: #333;
        }

        .Button--black {
          background-color: #000000;
        }

        .Button--green {
          background-color: #4be1ab;
        }

        .Button--inline {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          display: inline-flex;
        }

        .Button--normal {
          padding: 14px 24px;
        }
      `}</style>
      <button className={classes} onClick={onClick}>
        {children}
      </button>
    </span>
  );

  if (pathname) {
    return <Link href={{ pathname, query }}>{component}</Link>;
  } else {
    return component;
  }
};

export default Button;
