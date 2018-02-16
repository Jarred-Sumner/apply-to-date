import { updateEntities, setCurrentUser } from "../redux/store";
import { getProfile, getCurrentUser } from "../api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Page from "./Page";

export const LOGIN_STATUSES = {
  pending: "pending",
  checking: "checking",
  loggedIn: "loggedIn",
  guest: "guest"
};

export default (Component, options = {}) => {
  class LoginGate extends React.Component {
    constructor(props) {
      super(props);

      if (props.currentUser) {
        this.state = {
          loginStatus: LOGIN_STATUSES.loggedIn
        };
      } else {
        this.state = {
          loginStatus: LOGIN_STATUSES.pending
        };
      }
    }

    async componentDidMount() {
      const { loginStatus } = this.state;
      if (
        typeof window !== "undefined" &&
        loginStatus !== LOGIN_STATUSES.checking &&
        !options.skipRequest &&
        !this.props.currentUser
      ) {
        this.setState({
          loginStatus: LOGIN_STATUSES.checking
        });

        const userResponse = await getCurrentUser();

        if (userResponse.body.data) {
          this.props.setCurrentUser(userResponse.body.data.id);
          this.props.updateEntities(userResponse.body);

          this.setState({
            loginStatus: LOGIN_STATUSES.loggedIn
          });
        } else {
          this.setState({
            loginStatus: LOGIN_STATUSES.guest
          });
        }
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.status !== this.state.status) {
        const { status } = this.state;

        if (status === LOGIN_STATUSES.guest) {
          if (options.loginRequired && !this.props.currentUser) {
            Router.push(
              `/login?from=${encodeURIComponent(
                this.props.url.pathname + this.props.url.search
              )}`
            );
          }
        }
      }
    }

    render() {
      const { loginRequired = false } = options;
      const { children, isProbablyLoggedIn, ...otherProps } = this.props;
      const { loginStatus } = this.state;

      if (
        loginRequired &&
        [LOGIN_STATUSES.pending, LOGIN_STATUSES.checking].includes(loginStatus)
      ) {
        return (
          <Page
            headerProps={{
              pending: true,
              isProbablyLoggedIn
            }}
            isLoading
          />
        );
      } else if (loginRequired && loginStatus === LOGIN_STATUSES.guest) {
        return <Page>To continue, please login</Page>;
      }

      return (
        <Component
          isProbablyLoggedIn={isProbablyLoggedIn}
          loginStatus={loginStatus}
          {...otherProps}
        >
          {children}
        </Component>
      );
    }
  }

  LoginGate.getInitialProps = Component.getInitialProps;

  return connect(
    (state, props) => {
      return {
        isProbablyLoggedIn: !!state.currentUserId,
        currentUserId: state.currentUserId,
        currentUser:
          state && state.currentUserId ? state.user[state.currentUserId] : null
      };
    },
    dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
  )(LoginGate);
};
