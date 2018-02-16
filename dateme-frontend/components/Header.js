import Brand from "./Brand";
import Sticky from "react-stickynode";
import Button from "./Button";
import LoginGate, { LOGIN_STATUSES } from "./LoginGate";
import { AlertHost } from "./Alert";
import FeedbackForm from "./FeedbackForm";
// import Hamburger from "../components/Hamburger";
import BurgerIcon from "../components/BurgerIcon";
import MobileDropdownHeader from "../components/MobileDropdownHeader";
import BetaGate from "./BetaGate";

class Header extends React.Component {
  renderAuthButtons = () => {
    if (this.props.loginStatus === LOGIN_STATUSES.loggedIn) {
      return null;
    }

    return (
      <div className="Buttons">
        <Button href="/login" fill={false}>
          Sign in
        </Button>

        <Button href="/sign-up/verify" fill>
          Get your own page
        </Button>

        <style jsx>{`
          .Buttons {
            margin-left: auto;
            display: grid;
            grid-template-columns: auto auto;
            grid-template-rows: 1fr;
            grid-column-gap: 14px;
          }
        `}</style>
      </div>
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

  constructor(props) {
    super(props);
    this.state = {
      isHamburgerOpen: false
    };
  }

  setHamburgerOpen = isHamburgerOpen => this.setState({ isHamburgerOpen });

  render() {
    const {
      isSticky = true,
      showChildren = false,
      pending = false,
      renderSubheader,
      children
    } = this.props;

    const { isHamburgerOpen } = this.state;

    return (
      <React.Fragment>
        <Sticky enabled={isSticky} innerZ={1000}>
          <div>
            <header>
              <Brand />

              {showChildren && !pending && children}
              <BetaGate>
                <div className="RightSide">
                  <BurgerIcon
                    isOpen={isHamburgerOpen}
                    setOpen={this.setHamburgerOpen}
                  />
                  {!showChildren && !pending && this.renderButtons()}
                </div>
              </BetaGate>

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

            <MobileDropdownHeader isOpen={isHamburgerOpen} />

            {renderSubheader && renderSubheader()}
          </div>
        </Sticky>
        <AlertHost />
      </React.Fragment>
    );
  }
}

export default LoginGate(Header);
