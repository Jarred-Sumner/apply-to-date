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
import { getCurrentUser, resetPassword } from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import Page from "../components/Page";
import withLogin from "../lib/withLogin";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      isResettingPassword: false
    };
  }

  setPassword = password => this.setState({ password });

  handleResetPassword = async evt => {
    evt.preventDefault();
    const { isResettingPassword } = this.state;
    if (isResettingPassword) {
      return;
    }

    this.setState({
      isResettingPassword: true
    });

    try {
      const userResponse = await resetPassword(
        this.props.url.query.id,
        this.state.password
      );

      this.props.setCurrentUser(userResponse.body.data.id);
      this.props.updateEntities(userResponse.body);
      this.props.setLoginStatus(userResponse.body.data);

      const username = _.get(userResponse, "body.data.username");
      if (username) {
        Router.push(`/${username}/edit`);
      } else {
        Router.push(`/account`);
      }

      Alert.success("Your password has been reset");
    } catch (exception) {
      handleApiError(exception);
    }

    this.setState({ isResettingPassword: false });
  };

  render() {
    const { username, password, isResettingPassword } = this.state;

    return (
      <Page size="small">
        <Head title="Reset Password | ApplyToDate" />
        <article>
          <main>
            <Text type="PageTitle">Reset Password</Text>

            <form onSubmit={this.handleResetPassword}>
              <FormField
                name="password"
                type="password"
                value={password}
                label="Password"
                onChange={this.setPassword}
                autoFocus
                required
                minLength={3}
              />

              <Button pending={isResettingPassword}>Reset Password</Button>
            </form>
          </main>
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

const ResetPasswordWithStore = withRedux(
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
)(withLogin(ResetPassword));

export default ResetPasswordWithStore;
