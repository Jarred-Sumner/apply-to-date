import Link from "next/link";
import classNames from "classnames";

const Button = ({
  onClick,
  href,
  prefetch,
  className,
  children,
  inline,
  fill = true,
  size = "normal",
  componentType = "button",
  color = "black",
  icon
}) => {
  const realComponentType = href ? "a" : componentType;
  const classes = classNames("Button", {
    "Button--iconOnly": !children && !!icon,
    "Button--icon": !!icon,
    "Button--black--fill": color === "black" && fill,
    "Button--black--unfill": color === "black" && !fill,
    "Button--green--fill": color === "green" && fill,
    "Button--green--unfill": color === "green" && !fill,
    "Button--gray--fill": color === "gray" && fill,
    "Button--gray--unfill": color === "gray" && !fill,
    "Button--twitter--fill": color === "twitter" && fill,
    "Button--instagram--fill": color === "instagram" && fill,
    "Button--facebook--fill": color === "facebook" && fill,
    "Button--large": size === "large",
    "Button--inline": !!inline,
    "Button--normal": size === "normal"
  });

  const component = (
    <React.Fragment>
      <style jsx>{`
        .Button {
          font-family: Open Sans, sans-serif;
          font-size: 12px;
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
          text-decoration: none;
          cursor: pointer;
          outline: 0;
        }

        .Button--black--fill:hover {
          background-color: #333;
        }

        .Button--black--fill {
          background-color: #000000;
          color: #fff;
        }

        .Button--black--unfill {
          border-color: #000000;
          color: #000;
        }

        .Button--black--unfill:hover {
          background-color: #f9f9f9;
        }

        .Button--green--fill {
          background-color: #4be1ab;
          color: #fff;
        }

        .Button--green--unfill {
          border-color: #4be1ab;
          color: #4be1ab;
        }

        .Button--inline {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          display: inline-flex;
        }

        .Button--normal {
          padding: 14px 24px;
        }

        .Button--twitter--fill {
          background-color: #55acee;
          color: #fff;
        }

        .Button--twitter--fill:hover {
          background-color: #4890c7;
          color: #fff;
        }

        .Button--facebook--fill {
          background-color: #3b5998;
          color: #fff;
        }

        .Button--facebook--fill:hover {
          background-color: #2f477a;
          color: #fff;
        }

        .Button--instagram--fill {
          background-image: linear-gradient(
            -110deg,
            #99389b 0%,
            #d94263 27%,
            #d32d79 78%,
            #ce2d94 100%
          );
          color: #fff;
        }

        .Button--instagram--fill:hover {
          background-image: linear-gradient(
            -130deg,
            #99389b 0%,
            #d94263 27%,
            #d32d79 78%,
            #ce2d94 100%
          );
          color: #fff;
        }
      `}</style>
      {realComponentType === "button" && (
        <button className={classes}>{children}</button>
      )}
      {realComponentType === "a" && (
        <a href={href} className={classes}>
          {children}
        </a>
      )}
      {realComponentType === "div" && <div className={classes}>{children}</div>}
    </React.Fragment>
  );

  if (href) {
    return <Link href={href}>{component}</Link>;
  } else {
    return component;
  }
};

export default Button;
