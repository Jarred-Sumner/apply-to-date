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
import Link from "next/link";
import Icon from "./Icon";
import ActiveLink from "./ActiveLink";
import Text from "./Text";
import classNames from "classnames";
import _ from "lodash";

const NavLink = ActiveLink(({ children, href, isActive }) => {
  return (
    <a
      href={href}
      className={classNames("Container", {
        "Container--active": isActive,
        "Container--inactive": !isActive
      })}
    >
      {children}

      <style jsx>{`
        .Container {
          display: flex;
          transition: opacity 0.1s linear;
          text-decoration: none;
        }
        .Container--inactive {
          opacity: 0.75;
        }

        .Container--inactive:hover,
        .Container--active {
          opacity: 1;
        }
      `}</style>
    </a>
  );
});

const HeaderLinks = ({ isProbablyLoggedIn, currentUser }) => {
  if (isProbablyLoggedIn) {
    const editPageHref = `/${_.get(
      currentUser || {},
      "username",
      "page"
    )}/edit`;
    return (
      <div className="Buttons">
        <NavLink key={editPageHref} href={editPageHref}>
          <Icon color="#333" type="user" size="12px" />
          &nbsp;
          <Text casing="uppercase" weight="semiBold" size="12px">
            Edit page
          </Text>
        </NavLink>

        <NavLink key={"/applications"} href={"/applications"}>
          <Icon color="#333" type="heart" size="14px" />
          &nbsp;
          <Text casing="uppercase" weight="semiBold" size="12px">
            Review applications
          </Text>
        </NavLink>

        <style jsx>{`
          .Buttons {
            margin-left: auto;
            margin-right: 28px;
            display: grid;
            grid-template-columns: auto auto;
            grid-template-rows: 1fr;
            grid-column-gap: 28px;
            align-items: center;
          }

          @media (max-width: 500px) {
            .Buttons {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  } else {
    return (
      <div className="Buttons">
        <NavLink key="/login" href={"/login"}>
          <Text casing="uppercase" weight="semiBold" size="12px">
            Login
          </Text>
        </NavLink>

        <NavLink key="/sign-up/verify" href={"/sign-up/verify"}>
          <Icon color="#333" type="user" size="12px" />
          &nbsp;
          <Text casing="uppercase" weight="semiBold" size="12px">
            Sign up
          </Text>
        </NavLink>

        <style jsx>{`
          .Buttons {
            margin-left: auto;
            margin-right: 28px;
            display: grid;
            grid-template-columns: auto auto;
            grid-template-rows: 1fr;
            grid-column-gap: 28px;
            align-items: center;
          }

          @media (max-width: 500px) {
            .Buttons {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  }
};

class Header extends React.Component {
  renderButtons = () => {
    return (
      <React.Fragment>
        <HeaderLinks
          isProbablyLoggedIn={this.props.isProbablyLoggedIn}
          currentUser={this.props.currentUser}
        />
        <FeedbackForm />
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

              {showChildren && children}
              <div className="RightSide">
                <BurgerIcon
                  isOpen={isHamburgerOpen}
                  setOpen={this.setHamburgerOpen}
                />
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

            <MobileDropdownHeader
              isProbablyLoggedIn={this.props.isProbablyLoggedIn}
              isOpen={isHamburgerOpen}
            />

            {renderSubheader && renderSubheader()}
          </div>
        </Sticky>
        <AlertHost />
      </React.Fragment>
    );
  }
}

export default LoginGate(Header, {
  allowIncomplete: true
});
