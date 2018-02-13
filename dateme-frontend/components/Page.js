import PageFooter from "./PageFooter";
import Header from "./Header";
import classNames from "classnames";
import Head from "../components/head";

const PageSpinner = ({}) => {
  return (
    <div className="Container">
      <div className="PageSpinner" />

      <style jsx>{`
        .Container {
          height: 100vh;
          width: 100%;
          display: flex;
        }
        .PageSpinner {
          display: flex;
          content: "";
          margin: auto;
          height: 18px;
          width: 18px;
          animation: rotate 1s infinite linear;
          border: 8px solid #666;
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
      `}</style>
    </div>
  );
};

export default ({
  headerProps,
  isLoading = false,
  children,
  size = "default",
  renderMessage
}) => {
  const classes = classNames("PageSize", {
    "PageSize--default": size === "default",
    "PageSize--small": size === "small"
  });

  return (
    <React.Fragment>
      <Header {...headerProps} />
      {renderMessage && renderMessage()}
      <main id="PageRoot" className={classes}>
        {isLoading && <PageSpinner />}
        {isLoading && <Head />}
        {!isLoading && children}
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
