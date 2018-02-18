import classNames from "classnames";
import { Portal } from "react-portal";

export default ({
  children,
  bottom = false,
  center = false,
  fade = false,
  spaceBetween
}) => {
  if (!bottom) {
    return (
      <div
        className={classNames("Subheader", {
          "Subheader--spaceBetween": spaceBetween,
          "Subheader--center": center,
          "Subheader--fade": fade
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
            "Subheader--fade": fade
          })}
        >
          {children}

          <style jsx>{`
            .Subheader {
              background-color: white;
              display: flex;
              align-items: center;
              padding: 21px 40px;
              flex: 1;
              border-top: 1px solid #e8e8e8;
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
            }

            .Subheader--spaceBetween {
              justify-content: space-between;
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
      </Portal>
    );
  }
};
