import classNames from "classnames";
import { Portal } from "react-portal";

export default ({ children, bottom = false, spaceBetween }) => {
  if (!bottom) {
    return (
      <div
        className={classNames("Subheader", {
          "Subheader--spaceBetween": spaceBetween
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
        `}</style>
      </div>
    );
  } else {
    return (
      <Portal>
        <div
          className={classNames("Subheader", {
            "Subheader--spaceBetween": spaceBetween
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
              border-top: 1px solid #e8e8e8;
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
            }

            .Subheader--spaceBetween {
              justify-content: space-between;
            }
          `}</style>
        </div>
      </Portal>
    );
  }
};
