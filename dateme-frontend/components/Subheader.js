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
  padding,
  spaceBetween
}) => {
  if (!bottom) {
    return (
      <div
        className={classNames("Subheader", {
          "Subheader--spaceBetween": spaceBetween,
          "Subheader--center": center,
          "Subheader--fade": fade,
          "Subheader--shadow": !!shadow
        })}
      >
        {children}

        <style jsx>{`
          .Subheader {
            background-color: white;
            display: flex;
            align-items: center;
            padding: 10px 40px;
            flex: 1;
            border-bottom: 1px solid #e8e8e8;
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
            background: linear-gradient(
              -180deg,
              rgba(255, 255, 255, 0.16) 0%,
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
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
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
              background: linear-gradient(
                -180deg,
                rgba(255, 255, 255, 0.16) 0%,
                #ffffff 100%
              );
            }
          `}</style>
        </div>
      </Portal>
    );
  }
};
