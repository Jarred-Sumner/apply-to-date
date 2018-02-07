import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getFeaturedProfiles, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Router from "next/router";
import Alert from "../components/Alert";

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

  login = evt => {};

  render() {
    const { username, password, isLoggingIn } = this.state;

    return (
      <div>
        <Head title="Login | ApplyToDate" />
        <Header />
        <article>
          <main>
            <Text type="PageTitle">Login</Text>

            <form onSubmit={this.login}>
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
                value={username}
                label="Password"
                onChange={this.setPassword}
                required
                minLength={3}
              />

              <Button>Login</Button>
            </form>
          </main>

          <footer>
            <Link href={"/forgot-password"}>
              <a>
                <Text size="14px" type="link">
                  Forgot your password?
                </Text>
              </a>
            </Link>
          </footer>
        </article>
        <style jsx>{`
          article {
            margin-top: 6rem;
            margin-bottom: 3rem;
            max-width: 710px;
            margin-left: auto;
            margin-right: auto;
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

          footer {
            display: flex;
            flex-direction: column;
            text-align: left;
            padding-left: 22px;
          }
        `}</style>
      </div>
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
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(Login);

export default LoginWithStore;
