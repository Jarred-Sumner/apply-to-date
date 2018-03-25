import { Link } from "../routes";
import classNames from "classnames";
import { COLORS } from "../helpers/styles";

const Button = ({
  onClick,
  href,
  prefetch,
  className,
  children,
  target,
  inline,
  fill = true,
  size = "normal",
  componentType = "button",
  color = "black",
  icon,
  rightIcon,
  circle = false,
  pending = false,
  disabled = false,
  maxWidth
}) => {
  const realComponentType = href ? "a" : componentType;
  const iconOnly = !children && !!icon;
  const classes = classNames("Button", className, {
    "Button--iconOnly": iconOnly,
    "Button--icon": !!icon,
    "Button--circle": !!circle,
    "Button--blue--unfill": color === "blue" && !fill,
    "Button--blue--fill": color === "blue" && fill,
    "Button--black--fill": color === "black" && fill,
    "Button--black--unfill": color === "black" && !fill,
    "Button--green--fill": color === "green" && fill,
    "Button--green--unfill": color === "green" && !fill,
    "Button--red--fill": color === "red" && fill,
    "Button--red--unfill": color === "red" && !fill,
    "Button--white--fill": color === "white" && fill,
    "Button--white--unfill": color === "white" && !fill,
    "Button--twitter--fill": color === "twitter" && fill,
    "Button--instagram--fill": color === "instagram" && fill,
    "Button--instagram--unfill": color === "instagram" && !fill,
    "Button--facebook--fill": color === "facebook" && fill,
    "Button--large": size === "large",
    "Button--inline": !!inline,
    "Button--small": size === "small",
    "Button--xsmall": size === "xsmall",
    "Button--normal": size === "normal",
    "Button--fit": size === "fit",
    "Button--pending": pending,
    "Button--disabled": disabled
  });

  const component = (
    <React.Fragment>
      <style jsx>{`
        .Button {
          font-family: Open Sans, sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 0.5px;
          appearance: none;
          text-align: center;
          justify-content: center;
          align-content: center;
          align-items: center;
          border: 1px solid transparent;
          align-items: center;
          display: flex;
          border-radius: 33px;
          box-shadow: none;
          color: #ffffff;
          text-decoration: none;
          cursor: pointer;
          outline: 0;
          text-align: center;

          transition: opacity 0.15s linear;
          transition-property: opacity, transform;
          white-space: nowrap;
        }

        .ButtonText {
          display: flex;
          color: inherit;
        }

        .Button--black--fill:hover {
          background-color: #333;
        }

        .Button--white--unfill {
          border-color: #333;
          color: #333;
        }

        .Button--white--unfill:hover {
          border-color: #000;
          color: #000;
        }

        .Button--black--fill {
          background-color: #000000;
          color: #fff;
        }

        .Button--black--unfill {
          background-color: transparent;
          border-color: #333;
          color: #333;
        }

        .Button--black--unfill:hover {
          border-color: #000;
          background-color: #fafafa;
          color: #000;
        }

        .Button--green--fill {
          background-color: #0aca9b;
          color: #fff;
        }

        .Button--blue--fill {
          background-color: ${COLORS.BLUE};
          color: #fff;
        }

        .Button--blue--unfill {
          border-color: ${COLORS.BLUE};
          background-color: #fff;
          color: ${COLORS.BLUE};
        }

        .Button--blue--fill:hover {
          background-color: color(rgb(0, 158, 255) shade(10%));
          color: #fff;
        }

        .Button--red--fill {
          background-color: #860f06;
          color: #fff;
        }

        .Button--green--unfill {
          border-color: #0aca9b;
          color: #0aca9b;
        }

        .Button--large {
          padding: 16px 24px;
          font-size: 14px;
          ${maxWidth && `max-width: ${maxWidth};`};
        }

        .Button--normal {
          padding: 10px 24px;
        }

        .Button--small {
          padding: 5px 16px;
        }

        .Button--xsmall {
          width: 30px;
          height: 30px;
          margin-top: auto;
          margin-bottom: auto;
        }

        .Button--fit {
          width: 100%;
          border-radius: 4px;
          padding-top: 7px;
          padding-bottom: 7px;
        }

        .Button--circle {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          padding: 0px;
          align-items: center;
          justify-content: center;
        }

        .Button.Button--iconOnly {
          border-radius: 50%;
          width: 32px;
          height: 32px;
          justify-content: center;
          align-items: center;
          padding: 0;
        }

        .Button--iconOnly .IconContainer {
          margin-right: 0;
        }

        .Button--inline {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          display: inline-flex;
          padding: 12px 24px;
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

        .Button--instagram--unfill {
          border-color: #d94263;
          color: #d94263;
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

        .IconContainer {
          align-items: center;
          display: flex;
        }

        .IconContainer--left {
          padding-right: 8px;
          margin-right: auto;
        }

        .ButtonText {
          margin-left: auto;
          margin-right: auto;
          align-items: center;
        }

        .IconContainer--right {
          padding-left: 8px;
          margin-left: auto;
        }

        .Button--pending {
          position: relative;
          text-indent: 14px;
          opacity: 0.8;
          pointer-events: none;
        }

        .Button--disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .Button--pending:after {
          position: absolute;
          top: 0;
          display: flex;
          content: "";
          left: 14px;
          bottom: 0;
          margin-top: auto;
          margin-bottom: auto;
          height: 7px;
          width: 7px;
          animation: rotate 0.8s infinite linear;
          border: 4px solid #fff;
          border-right-color: transparent;
          border-radius: 50%;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 500px) {
          .Button--inline {
            padding: 5px 7px;
          }
        }
      `}</style>
      {realComponentType === "button" && (
        <button onClick={onClick} className={classes}>
          <div className="IconContainer IconContainer--left">
            {!pending && !iconOnly && icon}
          </div>
          <div className="ButtonText">{children || (iconOnly && icon)}</div>
          <div className="IconContainer IconContainer--right">
            {!pending && rightIcon}
          </div>
        </button>
      )}
      {realComponentType === "a" && (
        <a
          target={target || undefined}
          onClick={onClick}
          href={href}
          className={classes}
        >
          <div className="IconContainer IconContainer--left">
            {!pending && !iconOnly && icon}
          </div>
          <div className="ButtonText">{children || (iconOnly && icon)}</div>
          <div className="IconContainer IconContainer--right">
            {!pending && rightIcon}
          </div>
        </a>
      )}
      {realComponentType === "div" && (
        <div onClick={onClick} className={classes}>
          <div className="IconContainer IconContainer--left">
            {!pending && !iconOnly && icon}
          </div>
          <div className="ButtonText">{children || (iconOnly && icon)}</div>
          <div className="IconContainer IconContainer--right">
            {!pending && rightIcon}
          </div>
        </div>
      )}
    </React.Fragment>
  );

  if (href) {
    return <Link route={href}>{component}</Link>;
  } else {
    return component;
  }
};

export default Button;
