import classNames from "classnames";
import { Portal } from "react-portal";

export default ({
  children,
  bottom = false,
  center = false,
  fade = false,
  shadow = false,
  transparent = false,
  noBorder = false,
  direction = "row",
  padding,
  position = "fixed",
  spaceBetween
}) => {
  if (!bottom) {
    return (
      <div
        className={classNames("Subheader", {
          "Subheader--spaceBetween": spaceBetween,
          "Subheader--center": center,
          "Subheader--fade": fade,
          "Subheader--shadow": !!shadow,
          "Subheader--noPadding": padding === "none",
          "Subheader--transparent": transparent
        })}
      >
        {children}

        <style jsx>{`
          .Subheader {
            background-color: white;
            display: flex;
            align-items: center;
            padding: 10px 40px;
            flex-direction: ${direction};
            flex: 1;
            border-bottom: 1px solid #e8e8e8;
          }

          .Subheader--noPadding {
            padding: 0;
          }

          .Subheader--transparent {
            background-color: transparent;
          }

          .Subheader--spaceBetween {
            justify-content: space-between;
          }

          .Subheader--shadow {
            box-shadow: 0 -2px 15px 0 rgba(0, 0, 0, 0.05);
          }

          .Subheader--center {
            justify-content: center;
          }

          .Subheader--fade {
            border: 0;
            background-color: transparent;
            background-image: linear-gradient(
              -180deg,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(255, 255, 255, 0.54) 47%,
              #ffffff 100%
            );
          }
        `}</style>
      </div>
    );
  } else {
    return (
      <Portal>
        <div
          className={classNames("Subheader", {
            "Subheader--spaceBetween": spaceBetween,
            "Subheader--center": center,
            "Subheader--largePadding": padding === "large",
            "Subheader--normalPadding": padding === "normal",
            "Subheader--fade": fade,
            "Subheader--shadow": !!shadow,
            "Subheader--noBorder": !!noBorder
          })}
        >
          {children}

          <style jsx>{`
            .Subheader {
              background-color: ${transparent ? "transparent" : "white"};
              display: flex;
              align-items: center;
              flex: 1;
              border-top: 1px solid #e8e8e8;
              position: ${position};
              flex-direction: ${direction};
              bottom: 0;
              left: 0;
              right: 0;
            }

            .Subheader--normalPadding {
              padding: 10px 40px;
            }

            .Subheader--largePadding {
              padding: 21px 40px;
            }

            .Subheader--spaceBetween {
              justify-content: space-between;
            }

            .Subheader--shadow {
              box-shadow: 0 -2px 15px 0 rgba(0, 0, 0, 0.05);
            }

            .Subheader--center {
              justify-content: center;
            }

            .Subheader--noBorder {
              border-top: 0;
            }

            .Subheader--fade {
              border: 0;
              background-color: transparent;
              background-image: linear-gradient(
                -180deg,
                rgba(255, 255, 255, 0.16) 0%,
                rgba(255, 255, 255, 0.92) 47%,
                #ffffff 100%
              );
            }
          `}</style>
        </div>
      </Portal>
    );
  }
};
