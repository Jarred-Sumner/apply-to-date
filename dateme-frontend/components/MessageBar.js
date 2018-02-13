import classNames from "classnames";

export default ({ children, color = "#3B55E6" }) => {
  return (
    <div className="MessageBar">
      <div className="MessageBar-content">{children}</div>

      <style jsx>{`
        .MessageBar {
          background-color: ${color};
          padding: 14px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .MessageBar-content {
          text-align: center;
        }
      `}</style>
    </div>
  );
};
