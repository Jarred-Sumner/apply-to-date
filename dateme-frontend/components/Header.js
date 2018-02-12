import Brand from "./Brand";
import Sticky from "react-stickynode";
import Button from "./Button";
import LoginGate, { LOGIN_STATUSES } from "./LoginGate";
import { AlertHost } from "./Alert";
import FeedbackForm from "./FeedbackForm";
import Hamburger from "../components/Hamburger";

class Header extends React.Component {
  renderAuthButtons = () => {
    // if (this.props.loginStatus === LOGIN_STATUSES.loggedIn) {
    //   return null;
    // }
    return (
      <Hamburger />
      // <div className="Buttons">
      //   <Button href="/login" fill={false}>
      //     Sign in
      //   </Button>

      //   <Button href="/sign-up" fill>
      //     Get your own site
      //   </Button>

      //   <style jsx>{`
      //     .Buttons {
      //       margin-left: auto;
      //       display: grid;
      //       grid-template-columns: auto auto;
      //       grid-template-rows: 1fr;
      //       grid-column-gap: 14px;
      //     }
      //   `}</style>
      // </div>
    );
  };

  renderButtons = () => {
    return (
      <React.Fragment>
        <FeedbackForm />
        {this.renderAuthButtons()}
      </React.Fragment>
    );
  };

  render() {
    const {
      isSticky = true,
      showChildren = false,
      renderSubheader,
      children
    } = this.props;

    return (
      <React.Fragment>
        <Sticky enabled={isSticky}>
          <div>
            <header>
              <Brand />

              {showChildren && children}
              <div className="RightSide">
                {!showChildren && this.renderButtons()}
              </div>

              <style jsx>{`
                header {
                  padding: 14px 40px;
                  display: flex;
                  border-bottom: 1px solid #e8e8e8;
                  background-color: white;
                  z-index: 999;
                }

                .RightSide {
                  margin-left: auto;
                  margin-top: auto;
                  margin-bottom: auto;
                  display: flex;
                }

                @media (max-width: 460px) {
                  header {
                    padding: 18px 20px;
                  }
                }
              `}</style>
            </header>

            {renderSubheader && renderSubheader()}
          </div>
        </Sticky>
        <AlertHost />
      </React.Fragment>
    );
  }
}

export default LoginGate(Header);
