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
import { getCurrentUser, login } from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import Page from "../components/Page";
import LoginGate from "../components/LoginGate";

class Gate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      application: null,
      isLoading: true
    };
  }

  loadNext = () => {};
}

class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRating: false
    };
  }

  static async getInitialProps({ query, store, req, isServer }) {
    const profileResponse = await getProfile(query.id);
    store.dispatch(updateEntities(profileResponse.body));

    const applicationResponse = await getSavedApplication(query.applicationId);
    store.dispatch(updateEntities(applicationResponse.body));
  }

  render() {
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
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(LoginGate(Login, { loginRequired: true }));

export default LoginWithStore;
