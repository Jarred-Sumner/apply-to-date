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
  gray = false,
  size = "default",
  renderMessage,
  renderOutside,
  contentScrolls = false
}) => {
  const classes = classNames("PageSize", {
    "PageSize--default": size === "default",
    "PageSize--small": size === "small",
    "PageSize--large": size === "large",
    "PageSize--full": size === "100%",
    "PageSize--contentScrolls": !!contentScrolls
  });

  return (
    <React.Fragment>
      <Header {...headerProps} />
      {renderMessage && renderMessage()}
      {renderOutside && renderOutside()}
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
          display: flex;
          flex-direction: column;
          background-color: ${gray ? "#F5F5F5" : "unset"};
        }

        .PageSize--full {
          max-width: 100%;
          min-height: 100%;
        }

        main.PageSize--full {
          padding-bottom: 0;
          width: 100%;
        }

        footer.PageSize--full {
          display: none;
        }

        .PageSize--large {
          max-width: 960px;
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

        main.PageSize--contentScrolls {
          min-height: 0;
          height: 100%;
          padding-left: 0;
          padding-right: 0;
          margin-left: 0;
          margin-right: 0;
        }

        @media (max-width: 500px) {
          .PageSize--default {
            max-width: 100%;
          }

          .PageSize--small {
            max-width: 100%;
          }
        }
      `}</style>
    </React.Fragment>
  );
};
