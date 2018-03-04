import Brand from "./Brand";
import Sticky from "react-stickynode";
import Button from "./Button";
import LoginGate, { LOGIN_STATUSES } from "./LoginGate";
import { withRouter } from "next/router";
import { AlertHost } from "./Alert";
import FeedbackForm from "./FeedbackForm";
import BurgerIcon from "../components/BurgerIcon";
import MobileDropdownHeader from "../components/MobileDropdownHeader";
import BetaGate from "./BetaGate";
import { Link } from "../routes";
import Icon from "./Icon";
import ActiveLink from "./ActiveLink";
import Text from "./Text";
import classNames from "classnames";
import _ from "lodash";
import { Router } from "../routes";
import { buildEditProfileURL } from "../lib/routeHelpers";
import ProfileMenu from "./ProfileMenu";
import { setIsMobile } from "../lib/Mobile";

const isSwitcherRouteActive = (router, href) => {
  return router.asPath.split("?")[0] === href;
};

const textTypeForRouter = (router, href) => {
  if (isSwitcherRouteActive(router, href)) {
    return "switcher--active";
  } else {
    return "switcher--inactive";
  }
};

class SwitcherItemComponent extends React.Component {
  componentDidMount() {
    Router.prefetchRoute(this.props.href);
  }

  handleClick = evt => {
    evt.preventDefault();

    Router.pushRoute(this.props.href);
  };

  render() {
    const { router, href, iconType, children, isMobile } = this.props;
    const isActive = isSwitcherRouteActive(router, href);

    return (
      <a
        onClick={this.handleClick}
        href={href}
        className={classNames("SwitcherItem Matchmake", {
          "SwitcherItem--active": isActive,
          "SwitcherItem--inactive": !isActive
        })}
      >
        <Icon type={iconType} size="17px" />
        {!isMobile && (
          <div className="TextWrapper">
            <Text type={textTypeForRouter(router, href)}>{children}</Text>
          </div>
        )}

        <style jsx>{`
          .SwitcherItem {
            padding: 7px 14px;
            display: grid;
            width: 100%;
            z-index: 1;
            height: 100%;
            grid-template-columns: 17px auto;
            grid-column-gap: 4px;
            align-items: center;
            border: 1px solid transparent;
          }

          :global(.SwitcherItem--inactive:first-of-type) {
            border-top-left-radius: 28px;
            border-bottom-left-radius: 28px;
          }

          :global(.SwitcherItem--inactive:last-of-type) {
            border-top-right-radius: 28px;
            border-bottom-right-radius: 28px;
          }

          .SwitcherItem--inactive:hover {
            background-color: #f9f9f9;
            border: 1px solid #dcdfe8;
          }

          .SwitcherItem--active {
            color: white;
          }

          .TextWrapper {
            margin-left: auto;
            margin-right: auto;
          }

          .SwitcherItem--active :global(.IconContainer .SVGFill) {
            fill: white !important;
          }

          .SwitcherItem--active :global(.IconContainer .SVGStroke) {
            stroke: white !important;
          }

          .SwitcherItem--inactive :global(.IconContainer .SVGFill) {
            fill: #9396a5 !important;
          }

          .SwitcherItem--inactive :global(.IconContainer .SVGStroke) {
            stroke: #9396a5 !important;
          }

          .SwitcherItem--inactive {
            background-image: none;
            background-color: transparent;
            color: #9396a5;
          }
        `}</style>
      </a>
    );
  }
}

const SwitcherItem = withRouter(SwitcherItemComponent);

const Switcher = withRouter(({ router, isMobile }) => (
  <div className="Wrapper">
    <div className="Switcher">
      <div
        className={classNames("Switcher-bg", "Switcher-bg--left", {
          "Switcher-bg--leftActive": isSwitcherRouteActive(router, "/shuffle")
        })}
      />
      <SwitcherItem isMobile={isMobile} href={"/shuffle"} iconType="shuffle">
        Shuffle
      </SwitcherItem>

      <SwitcherItem
        isMobile={isMobile}
        href={"/matchmake"}
        iconType="matchmake"
      >
        Matchmake
      </SwitcherItem>
      <div
        className={classNames("Switcher-bg", "Switcher-bg--right", {
          "Switcher-bg--rightActive": isSwitcherRouteActive(
            router,
            "/matchmake"
          )
        })}
      />

      <style jsx>{`
        .Switcher {
          display: grid;
          justify-content: center;
          align-items: center;
          grid-template-columns: 1fr 1fr;
          width: max-content;
          margin-left: auto;
          margin-right: auto;
          border-radius: 28px;
          position: relative;
        }

        .Switcher-bg {
          background-color: white;
          position: absolute;
          top: 0;
          bottom: 0;
          display: block;
          content: "";
          z-index: 0;

          width: 50%;
          height: 100%;
          border: 1px solid #dcdfe8;

          transition: transform 0.1s linear;
        }

        .Switcher-bg--left {
          border-top-left-radius: 28px;
          border-bottom-left-radius: 28px;
        }

        .Switcher-bg--right {
          border-top-right-radius: 28px;
          border-bottom-right-radius: 28px;
        }

        .Switcher-bg--leftActive,
        .Switcher-bg--rightActive {
          background-image: linear-gradient(
            -122deg,
            #00c0c7 0%,
            #00c8c5 49%,
            #03e0cb 100%
          );
          background-color: transparent;
          border: 0;
        }

        .Switcher-bg--left {
          left: 0;
        }

        .Switcher-bg--right {
          right: 0;
        }
      `}</style>
    </div>
  </div>
));

const NavLink = ActiveLink(({ children, href, isActive, onClick }) => {
  return (
    <a
      href={href}
      className={classNames("Container", {
        "Container--active": isActive,
        "Container--inactive": !isActive
      })}
      onClick={onClick}
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

const HeaderLinks = ({ isProbablyLoggedIn, currentUser, isMobile }) => {
  if (isProbablyLoggedIn) {
    const editPageHref = buildEditProfileURL(
      _.get(currentUser || {}, "username", "page")
    );

    return (
      <div className="Buttons">
        <NavLink key={editPageHref} href={editPageHref}>
          <Icon color="#333" type="user" size="12px" />
          &nbsp;
          <div className="TextWrapper">
            <Text casing="uppercase" weight="semiBold" size="12px">
              Edit page
            </Text>
          </div>
        </NavLink>

        <NavLink key={"/applications"} href={"/applications"}>
          <Icon color="#333" type="heart" size="14px" />
          &nbsp;
          <div className="TextWrapper">
            <Text casing="uppercase" weight="semiBold" size="12px">
              Review applications
            </Text>
          </div>
        </NavLink>

        {!isMobile && <ProfileMenu />}

        <style jsx>{`
          .Buttons {
            margin-right: 28px;
            display: grid;
            justify-content: flex-end;
            grid-template-columns: auto auto auto;
            grid-template-rows: 1fr;
            grid-column-gap: 28px;
            align-items: center;
            flex-shrink: 0;
          }

          @media (max-width: 900px) {
            .TextWrapper {
              display: none;
            }
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
            justify-content: flex-end;
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
          isMobile={this.props.isMobile}
        />
        <FeedbackForm />
      </React.Fragment>
    );
  };

  constructor(props) {
    super(props);
    this.state = {
      isHamburgerOpen: false,
      stickyStatus: Sticky.STATUS_ORIGINAL
    };
  }

  componentDidMount() {
    setIsMobile(this.props.isMobile);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isMobile !== this.props.isMobile) {
      setIsMobile(this.props.isMobile);
    }
  }

  handleStateChange = ({ status }) => {
    this.setState({ stickyStatus: status });
    if (this.props.onStickyChange) {
      this.props.onStickyChange(status);
    }
  };

  setHamburgerOpen = isHamburgerOpen => this.setState({ isHamburgerOpen });

  render() {
    const {
      isSticky = true,
      isMobile,
      showChildren = true,
      pending = false,
      renderSubheader,
      children
    } = this.props;

    const { isHamburgerOpen, stickyStatus } = this.state;

    return (
      <React.Fragment>
        <Sticky
          onStateChange={this.handleStateChange}
          enabled={isSticky}
          innerZ={1000}
        >
          <div>
            <header>
              <Brand hideText="auto" />

              {showChildren && !children ? (
                this.props.isProbablyLoggedIn ? (
                  <Switcher isMobile={isMobile} />
                ) : (
                  <div />
                )
              ) : null}
              {showChildren && children}
              <div className="RightSide">
                <BurgerIcon
                  isOpen={isHamburgerOpen}
                  setOpen={this.setHamburgerOpen}
                />
                <div className="DesktopHeader">{this.renderButtons()}</div>
              </div>

              <style jsx>{`
                header {
                  padding: 14px 40px;
                  display: grid;
                  border-bottom: 1px solid #e8e8e8;
                  background-color: white;
                  z-index: 999;
                  grid-template-areas: "left center right";
                  grid-template-columns: 1fr 1fr 1fr;
                  justify-content: space-between;
                  align-items: center;
                }

                .RightSide {
                  display: flex;
                  justify-content: flex-end;
                  grid-area: "right";
                }

                .DesktopHeader {
                  display: flex;
                }

                @media (max-width: 460px) {
                  header {
                    padding: 18px 20px;
                  }

                  .DesktopHeader {
                    display: none;
                  }
                }
              `}</style>
            </header>

            <MobileDropdownHeader
              isProbablyLoggedIn={this.props.isProbablyLoggedIn}
              isOpen={isHamburgerOpen}
              setOpen={this.setHamburgerOpen}
            />

            {renderSubheader &&
              renderSubheader({ isHamburgerOpen, stickyStatus })}
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
