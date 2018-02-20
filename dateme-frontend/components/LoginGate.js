import {
  updateEntities,
  setCurrentUser,
  setLoginStatus,
  setCheckingLogin
} from "../redux/store";
import { getProfile, getCurrentUser } from "../api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import _ from "lodash";
import withLogin from "../lib/withLogin";

export const LOGIN_STATUSES = {
  pending: "pending",
  checking: "checking",
  loggedIn: "loggedIn",
  guest: "guest"
};

export default _.memoize((Component, options = {}) => {
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
        typeof window !== "undefined" &&
        !options.skipRequest &&
        loginStatus !== LOGIN_STATUSES.checking
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
    }

    componentDidUpdate(prevProps, prevState) {
      if (
        typeof window !== "undefined" &&
        prevProps.loginStatus !== LOGIN_STATUSES.guest &&
        this.props.loginStatus === LOGIN_STATUSES.guest &&
        options.loginRequired
      ) {
        Router.pushRoute(
          `/login?from=${encodeURIComponent(this.props.url.asPath)}`
        );
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
        ...otherProps
      } = this.props;

      if (
        (isProbablyLoggedIn && allowIncomplete) ||
        currentUser ||
        !loginRequired
      ) {
        return (
          <Component
            isProbablyLoggedIn={isProbablyLoggedIn}
            loginStatus={loginStatus}
            currentUser={currentUser}
            currentUserId={currentUserId}
            {...otherProps}
          >
            {children}
          </Component>
        );
      } else {
        return null;
      }
    }
  }

  const ConnectedLoginGate = connect(
    (state, props) => {
      return {
        isProbablyLoggedIn: !!state.currentUserId,
        currentUserId: state.currentUserId,
        currentUser: state.user[state.currentUserId],
        loginStatus: state.loginStatus
      };
    },
    dispatch =>
      bindActionCreators(
        { updateEntities, setCurrentUser, setLoginStatus, setCheckingLogin },
        dispatch
      )
  )(LoginGate);

  ConnectedLoginGate.getInitialProps = Component.getInitialProps;

  return withLogin(ConnectedLoginGate);
});
