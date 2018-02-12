import classNames from "classnames";

export default ({ children, isMobile, spaceBetween }) => {
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
};
