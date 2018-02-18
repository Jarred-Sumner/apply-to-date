import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import Icon from "../components/Icon";
import FormField from "../components/FormField";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getCurrentUser, forgotPassword } from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import Page from "../components/Page";
import withLogin from "../lib/withLogin";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      isSendingPasswordReset: false
    };
  }

  setUsername = username => this.setState({ username });

  handleForgotPassword = async evt => {
    evt.preventDefault();
    const { isSendingPasswordReset } = this.state;
    if (isSendingPasswordReset) {
      return;
    }

    this.setState({
      isSendingPasswordReset: true
    });

    try {
      const userResponse = await forgotPassword(this.state.username);
      Alert.success("Sent password reset email!");
      this.setState({ isSent: true });
    } catch (exception) {
      handleApiError(exception);
    }

    this.setState({ isSendingPasswordReset: false });
  };

  render() {
    const { username, isSendingPasswordReset, isSent } = this.state;

    return (
      <Page size="small">
        <Head
          title="Forgot Password | Apply to Date"
          description="Get a link to reset your Apply to Date password"
        />

        <article>
          <main>
            <Text type="PageTitle">Forgot Password</Text>

            {isSent ? (
              <div className="Spacer">
                <Icon type="check" size="72px" color="#0ACA9B" />
                <Text type="paragraph">
                  Check your inbox for a link to reset that will let you reset
                  your password
                </Text>
              </div>
            ) : (
              <form onSubmit={this.handleForgotPassword}>
                <FormField
                  name="username"
                  type="text"
                  value={username}
                  placeholder="e.g. ylukem or lucy@shipfirstlabs.com"
                  label="Username or email"
                  onChange={this.setUsername}
                  required
                  autoFocus
                />

                <Button pending={isSendingPasswordReset}>
                  <Icon type="email" size="14px" color="#FFF" />&nbsp; Email
                  reset link
                </Button>
              </form>
            )}
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

          form,
          .Spacer {
            display: grid;
            grid-auto-rows: auto;
            grid-row-gap: 14px;
            margin-top: 32px;
            margin-bottom: 14px;
          }

          .username-link {
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

const ForgotPasswordWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(withLogin(ForgotPassword));

export default ForgotPasswordWithStore;
