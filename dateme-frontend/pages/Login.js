import Link from "next/link";
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

      const username = _.get(userResponse, "body.data.username");
      if (username) {
        Router.pushRoute(`/${username}/edit`);
      } else {
        Router.pushRoute(`/account`);
      }
    } catch (exception) {
      handleApiError(exception);
    }

    this.setState({ isLoggingIn: false });
  };

  render() {
    const { username, password, isLoggingIn } = this.state;

    return (
      <Page size="small">
        <Head title="Login | ApplyToDate" />
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
            <Link href={"/forgot-password"}>
              <a>
                <Text size="14px" type="link">
                  Forgot your password?
                </Text>
              </a>
            </Link>
          </div>
        </article>
        <style jsx>{`
          article {
            margin-top: 6rem;
            margin-bottom: 3rem;
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
            grid-auto-rows: auto;
            grid-row-gap: 14px;
          }

          .password-link {
            text-align: center;
          }

          footer {
            display: flex;
            flex-direction: column;
            text-align: center;
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
