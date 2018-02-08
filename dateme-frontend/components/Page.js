import PageFooter from "./PageFooter";
import Header from "./Header";

export default ({ headerProps, children }) => {
  return (
    <React.Fragment>
      <Header {...headerProps} />
      <main>{children}</main>

      <footer>
        <PageFooter />
      </footer>

      <style jsx>{`
        main {
          margin-left: auto;
          margin-right: auto;
          max-width: 710px;
          min-height: 100%;
          padding-bottom: 56px;
        }

        footer {
          margin-left: auto;
          margin-right: auto;
          max-width: 710px;
        }
      `}</style>
    </React.Fragment>
  );
};
