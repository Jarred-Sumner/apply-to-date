import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getVer, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Router from "next/router";
import classNames from "classnames";
import FormField from "../components/FormField";

const BASE_AUTHORIZE_URL = "http://localhost:3001/auth";

const EXTERNAL_ACCOUNT_LABELS = {
  twitter: "Twitter",
  youtube: "YouTube",
  facebook: "Facebook"
};

class CreateAccount extends React.Component {
  static async getInitialProps({ store, query }) {}
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.url.query.email || "",
      username: "",
      password: "",
      passwordConfirmation: "",
      isSubmitting: false
    };
  }

  submit = () => {};

  setEmail = email => this.setState({ email });
  setUsername = username => this.setState({ username });
  setPassword = password => this.setState({ password });
  setPasswordConfirmation = passwordConfirmation =>
    this.setState({ passwordConfirmation });

  render() {
    const { provider, id } = this.props.url.query;
    const {
      email,
      username,
      password,
      passwordConfirmation,
      isSubmitting
    } = this.state;

    return (
      <div>
        <Head title="Create account | ApplyToDate" />
        <Header />
        <article>
          <main>
            <Text type="PageTitle">Create account</Text>

            <div className="Row">
              <Text size="16px">
                Thanks for verifying with {EXTERNAL_ACCOUNT_LABELS[provider]}!
                Let's get you setup.
              </Text>
            </div>

            <form onSubmit={this.submit}>
              <FormField
                label="Your e-mail"
                type="email"
                name="email"
                required
                value={email}
                onChange={this.setEmail}
              />

              <FormField
                label="Your url"
                required
                name="username"
                value={username}
                onChange={this.setUsername}
              >
                <input
                  type="url"
                  tabIndex={-1}
                  name="url"
                  value="https://applytodate.me/"
                  readOnly
                />
              </FormField>

              <FormField
                label="Password"
                required
                name="password"
                value={password}
                minLength={3}
                type="password"
                onChange={this.setPassword}
              />

              <FormField
                label="Confirm password"
                required
                name="confirm-password"
                type="password"
                minLength={3}
                value={passwordConfirmation}
                onChange={this.setPasswordConfirmation}
              />

              <Button>Create site</Button>
            </form>
          </main>
        </article>
        <style jsx>{`
          article {
            max-width: 710px;
            margin-left: auto;
            margin-right: auto;
          }

          main {
            margin-top: 30px;
            display: grid;
            grid-template-rows: auto auto auto;
            grid-row-gap: 30px;
            justify-content: center;
            text-align: center;
          }

          input[type="url"] {
            border: 0;
            display: flex;
            outline: 0;
            appearance: none;
            box-shadow: none;
            border: 0;
            font-size: 14px;
            font-weight: 400;
            font-family: Lucida Grande, Open Sans, sans-serif;
            opacity: 0.75;
            background-color: #f0f2f7;
            margin-top: -12px;
            margin-bottom: -12px;
            margin-left: -22px;
            padding-left: 22px;
            cursor: default;
            margin-right: 12px;
            border-right: 1px solid #e3e8f0;
            border-top-left-radius: 100px;
            border-bottom-left-radius: 100px;
          }

          footer {
            display: flex;
            flex-direction: column;
            text-align: center;
          }

          form {
            display: grid;
            grid-template-rows: 1fr 1fr 1fr auto;
            grid-template-columns: 1fr;
            grid-row-gap: 14px;
          }
        `}</style>
      </div>
    );
  }
}

const CreateAccountWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(CreateAccount);

export default CreateAccountWithStore;
