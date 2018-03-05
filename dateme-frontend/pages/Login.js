import { Link } from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Text from "../components/Text";
import _ from "lodash";
import {
  updateEntities,
  setCurrentUser,
  setLoginStatus,
  initStore
} from "../redux/store";
import { getCurrentUser, login } from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import Page from "../components/Page";
import withLogin from "../lib/withLogin";
import {
  buildEditProfileURL,
  buildShufflePath,
  buildMatchmakePath
} from "../lib/routeHelpers";
import { logEvent } from "../lib/analytics";
import { BASE_AUTHORIZE_URL } from "../components/SocialLogin";
import SocialLink from "../components/SocialLink";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      isLoggingIn: false
    };
  }

  componentDidMount() {
    if (this.props.url.query.from) {
      Alert.error("To continue, please login");
    }
  }

  setUsername = username => this.setState({ username });
  setPassword = password => this.setState({ password });

  handleLogin = async evt => {
    evt.preventDefault();
    const { isLoggingIn } = this.state;
    if (isLoggingIn) {
      return;
    }

    this.setState({
      isLoggingIn: true
    });

    try {
      const userResponse = await login({
        username: this.state.username,
        password: this.state.password
      });

      this.props.setCurrentUser(userResponse.body.data.id);
      this.props.updateEntities(userResponse.body);
      this.props.setLoginStatus(userResponse.body.data);

      if (this.props.url.query.from) {
        Router.pushRoute(this.props.url.query.from);
      } else {
        const isShuffleEnabled =
          _.get(
            userResponse,
            "body.data.attributes.shuffle_status",
            "shuffle_allowed"
          ) === "shuffle_allowed";

        if (isShuffleEnabled) {
          Router.pushRoute(buildShufflePath());
        } else {
          Router.pushRoute(buildMatchmakePath());
        }
      }

      logEvent("Login");
    } catch (exception) {
      logEvent("Login Failed");
      handleApiError(exception);
    }

    this.setState({ isLoggingIn: false });
  };

  render() {
    const { username, password, isLoggingIn } = this.state;

    return (
      <Page size="small">
        <Head
          title="Login | Apply to Date"
          description="Login to your Apply to Date account."
        />
        <article>
          <main>
            <Text type="PageTitle">Login</Text>

            <form onSubmit={this.handleLogin}>
              <FormField
                name="email"
                type="text"
                placeholder="e.g. ylukem or lucy@shipfirstlabs.com"
                value={username}
                label="Username or email"
                onChange={this.setUsername}
                required
              />

              <FormField
                name="password"
                type="password"
                value={password}
                label="Password"
                onChange={this.setPassword}
                required
                minLength={3}
              />

              <Button pending={isLoggingIn}>Login</Button>
            </form>
          </main>
          <div className="password-link">
            <Link route={"/forgot-password"}>
              <a>
                <Text size="14px" type="link">
                  Forgot password?
                </Text>
              </a>
            </Link>

            <Text type="muted">|</Text>

            <Link route={"/sign-up/verify"}>
              <a>
                <Text size="14px" type="link">
                  Create an account
                </Text>
              </a>
            </Link>
          </div>

          <div className="Divider">
            <div className="DividerText">
              <Text casing="uppercase" type="muted">
                or
              </Text>
            </div>
          </div>

          <div className="SocialLogins">
            <a href={`${BASE_AUTHORIZE_URL}/twitter?signIn=true`}>
              <SocialLink
                hoverable
                active
                provider="twitter"
                width="42px"
                height="42px"
              />
            </a>

            <a href={`${BASE_AUTHORIZE_URL}/facebook?signIn=true`}>
              <SocialLink
                hoverable
                active
                provider="facebook"
                width="42px"
                height="42px"
              />
            </a>

            <a href={`${BASE_AUTHORIZE_URL}/instagram?signIn=true`}>
              <SocialLink
                hoverable
                active
                provider="instagram"
                width="42px"
                height="42px"
              />
            </a>
          </div>
        </article>
        <style jsx>{`
          article {
            margin-top: 6rem;
            margin-bottom: 3rem;
          }

          .Divider {
            display: flex;
            align-items: center;
          }

          .DividerText {
            margin-top: 34px;
            margin-bottom: 34px;
            padding-left: 14px;
            padding-right: 14px;
          }

          .Divider:after,
          .Divider:before {
            flex: 1;
            display: flex;
            content: "";
            background-color: #f0f2f7;
            height: 1px;
            width: 100%;
          }

          main {
            display: flex;
            flex-direction: column;
            text-align: center;

            justify-content: center;
          }

          form {
            display: grid;
            margin-top: 32px;
            margin-bottom: 14px;
            grid-template-rows: 70px 70px 40px;
            grid-row-gap: 14px;
            flex-grow: 0;
          }

          .password-link {
            text-align: center;
            display: grid;
            justify-content: center;
            align-content: center;
            grid-auto-flow: column;
            grid-column-gap: 7px;
          }

          footer {
            display: flex;
            flex-direction: column;
            text-align: center;
            flex-grow: 0;
          }

          .SocialLogins {
            display: grid;
            justify-content: center;
            align-content: center;
            grid-template-columns: auto auto auto;
            grid-column-gap: 42px;
          }
        `}</style>
      </Page>
    );
  }
}

const LoginWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch =>
    bindActionCreators(
      { updateEntities, setCurrentUser, setLoginStatus },
      dispatch
    )
)(withLogin(Login));

export default LoginWithStore;
