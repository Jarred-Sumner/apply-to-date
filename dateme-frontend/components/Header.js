import Brand from "./Brand";
import Sticky from "./StickyNode";
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
import Divider from "./Divider";
import classNames from "classnames";
import _ from "lodash";
import { Router } from "../routes";
import { buildEditProfileURL } from "../lib/routeHelpers";
import ProfileMenu from "./ProfileMenu";
import { setIsMobile } from "../lib/Mobile";
import { defaultProps } from "recompose";
import { isDatesEnabled } from "../helpers/dateEvent";

class _SwitcherItemComponent extends React.Component {
  get textType() {
    return this.props.isActive ? "switcher--active" : "switcher--inactive";
  }

  render() {
    const {
      router,
      href,
      iconType,
      isActive,
      children,
      isMobile,
      first,
      last,
      onClick
    } = this.props;

    return (
      <a
        onClick={onClick}
        href={href}
        className={classNames("SwitcherItem Matchmake", {
          "SwitcherItem--active": isActive,
          "SwitcherItem--first": first,
          "SwitcherItem--last": last,
          "SwitcherItem--inactive": !isActive
        })}
      >
        <Icon type={iconType} size="17px" />
        {!isMobile && (
          <div className="TextWrapper">
            <Text type={this.textType}>{children}</Text>
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

          .SwitcherItem--active {
            background-image: linear-gradient(
              -122deg,
              #00c0c7 0%,
              #00c8c5 49%,
              #03e0cb 100%
            );
            background-color: transparent;
          }

          .SwitcherItem--first {
            border-top-left-radius: 28px;
            border-bottom-left-radius: 28px;
          }

          .SwitcherItem--last {
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

const SwitcherItem = defaultProps({ prefetch: true })(
  ActiveLink(_SwitcherItemComponent)
);

const Switcher = withRouter(({ router, isMobile, showDates = false }) => (
  <div className="Wrapper">
    <div className="Switcher">
      <SwitcherItem
        first
        isMobile={isMobile}
        href={"/shuffle"}
        iconType="shuffle"
      >
        Shuffle
      </SwitcherItem>

      <Divider height="100%" color="#dcdfe8" width="1px" />

      {showDates && (
        <React.Fragment>
          <SwitcherItem
            isMobile={isMobile}
            href={"/dates"}
            additionalMatches={[/dates\/.*/]}
            iconType="date"
          >
            Dates
          </SwitcherItem>

          <Divider height="100%" color="#dcdfe8" width="1px" />
        </React.Fragment>
      )}

      <SwitcherItem
        last
        isMobile={isMobile}
        href={"/matchmake"}
        iconType="matchmake"
      >
        Matchmake
      </SwitcherItem>

      <style jsx>{`
        .Switcher {
          display: grid;
          justify-content: center;
          align-items: center;
          grid-area: "center";
          grid-auto-flow: column;
          grid-template-columns: ${showDates
            ? "1fr 1px 1fr 1px 1fr"
            : "1fr 1px 1fr"};
          border: 1px solid #dcdfe8;
          align-self: center;

          border-radius: 28px;
          position: relative;
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

        <NavLink key={"/matches"} href={"/matches"}>
          <Icon color="#333" type="heart" size="14px" />
          &nbsp;
          <div className="TextWrapper">
            <Text casing="uppercase" weight="semiBold" size="12px">
              Matches
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
          autoHide={isMobile}
          onStateChange={this.handleStateChange}
          enabled={isSticky}
          innerZ={1000}
        >
          <div>
            <header>
              <Brand hideText={isMobile} />

              {showChildren && !children ? (
                this.props.isProbablyLoggedIn ? (
                  <Switcher
                    showDates={isDatesEnabled(this.props.currentProfile)}
                    isMobile={isMobile}
                  />
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
                  grid-template-columns: 1fr auto 1fr;
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
