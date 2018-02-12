import PageFooter from "./PageFooter";
import Header from "./Header";
import classNames from "classnames";

export default ({ headerProps, children, size = "default" }) => {
  const classes = classNames("PageSize", {
    "PageSize--default": size === "default",
    "PageSize--small": size === "small"
  });

  return (
    <React.Fragment>
      <Header {...headerProps} />
      <main id="PageRoot" className={classes}>
        {children}
      </main>

      <footer className={classes}>
        <PageFooter />
      </footer>

      <style jsx>{`
        main {
          margin-left: auto;
          margin-right: auto;
          min-height: 100%;
          padding-bottom: 56px;
          padding-left: 14px;
          padding-right: 14px;
          max-width: 710px;
        }

        .PageSize--default {
          max-width: 710px;
        }

        .PageSize--small {
          max-width: 483px;
        }

        footer {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </React.Fragment>
  );
};
