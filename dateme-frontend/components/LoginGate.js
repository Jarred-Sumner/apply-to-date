import {
  updateEntities,
  setCurrentUser,
  setLoginStatus,
  setCheckingLogin,
  currentProfileSelector,
  currentUserSelector
} from "../redux/store";
import { getProfile, getCurrentUser } from "../api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import _ from "lodash";
import withLogin from "../lib/withLogin";
import Raven from "raven-js";
import Amplitude from "react-amplitude";
import { logEvent } from "../lib/analytics";
import { getMobileDetect, setIsMobile } from "../lib/Mobile";
import withSizes from "react-sizes";
import { SizesProvider } from "react-sizes";
import MobileDetect from "mobile-detect";

export const LOGIN_STATUSES = {
  pending: "pending",
  checking: "checking",
  loggedIn: "loggedIn",
  guest: "guest"
};

const configureAnalytics = user => {
  Amplitude.setUserId(user.id);
  Amplitude.setUserProperties({
    email: user.email,
    created_at: user.createdAt,
    username: user.username,
    gender: user.sex,
    interested_in_men: user.interested_in_men,
    interested_in_women: user.interested_in_women,
    interested_in_other: user.interested_in_other
  });
  Raven.setUserContext({
    email: user.email,
    id: user.id
  });
};

const getSizesFallback = userAgent => {
  const md = new MobileDetect(userAgent);

  if (!!md.mobile()) {
    return {
      fallbackWidth: 360,
      fallbackHeight: 640
    };
  } else if (!!md.tablet()) {
    return {
      fallbackWidth: 768,
      fallbackHeight: 1024
    };
  }

  return {
    fallbackWidth: 1280,
    fallbackHeight: 700
  };
};

const mapSizesToProps = ({ width }) => ({
  isMobile: width < 650
});

export default _.memoize((Component, options = {}) => {
  const ComponentWithSize = withSizes(mapSizesToProps)(Component);

  class LoginGate extends React.Component {
    constructor(props) {
      super(props);
    }

    async componentDidMount() {
      const {
        loginStatus,
        currentUser,
        setCheckingLogin,
        setLoginStatus,
        setCurrentUser,
        updateEntities
      } = this.props;

      if (
        !options.skipRequest &&
        loginStatus === LOGIN_STATUSES.pending &&
        !currentUser
      ) {
        setCheckingLogin();
        const userResponse = await getCurrentUser();
        const user = _.get(userResponse, "body.data", null);

        if (user) {
          setCurrentUser(user.id);
          updateEntities(userResponse.body);
          setLoginStatus(user);
        } else {
          setCurrentUser(null);
          setLoginStatus(null);
        }
      }

      if (this.props.currentUser && typeof window !== "undefined") {
        configureAnalytics(this.props.currentUser);
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (
        typeof window !== "undefined" &&
        prevProps.loginStatus !== LOGIN_STATUSES.guest &&
        this.props.loginStatus === LOGIN_STATUSES.guest &&
        options.loginRequired
      ) {
        Amplitude.resetUserId();
        logEvent("Unauthorized Page");
        Router.pushRoute(
          `/login?from=${encodeURIComponent(this.props.url.asPath)}`
        );
      }

      if (
        !prevProps.currentUser &&
        this.props.currentUser &&
        typeof window !== "undefined"
      ) {
        configureAnalytics(this.props.currentUser);
      }
    }

    render() {
      const { loginRequired = false, allowIncomplete = false } = options;
      const {
        children,
        isProbablyLoggedIn,
        loginStatus,
        currentUser,
        currentUserId,
        userAgent,
        head,
        ...otherProps
      } = this.props;

      if (
        (isProbablyLoggedIn && allowIncomplete) ||
        currentUser ||
        !loginRequired
      ) {
        return (
          <SizesProvider config={getSizesFallback(userAgent)}>
            <ComponentWithSize
              isProbablyLoggedIn={isProbablyLoggedIn}
              loginStatus={loginStatus}
              currentUser={currentUser}
              currentUserId={currentUserId}
              {...otherProps}
            >
              {children}
            </ComponentWithSize>
          </SizesProvider>
        );
      } else {
        if (options.head) {
          return (
            <React.Fragment>
              <SizesProvider config={getSizesFallback(userAgent)}>
                <div />
              </SizesProvider>
              {options.head}
            </React.Fragment>
          );
        } else {
          return (
            <SizesProvider config={getSizesFallback(userAgent)}>
              <div />
            </SizesProvider>
          );
        }
      }
    }
  }

  const ConnectedLoginGate = connect(
    (state, props) => {
      return {
        isProbablyLoggedIn: !!state.currentUserId,
        currentUserId: state.currentUserId,
        currentUser: currentUserSelector(state),
        currentProfile: currentProfileSelector(state),
        loginStatus: state.loginStatus,
        userAgent: state.userAgent
      };
    },
    dispatch =>
      bindActionCreators(
        { updateEntities, setCurrentUser, setLoginStatus, setCheckingLogin },
        dispatch
      ),
    null,
    { pure: false }
  )(LoginGate);

  ConnectedLoginGate.getInitialProps = Component.getInitialProps;

  return withLogin(ConnectedLoginGate);
});
