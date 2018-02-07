import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getVerification, getCurrentUser, createAccount } from "../api";
import { bindActionCreators } from "redux";
import Router from "next/router";
import classNames from "classnames";
import FormField from "../components/FormField";
import Icon from "../components/Icon";
import Alert, { handleApiError } from "../components/Alert";

const BASE_AUTHORIZE_URL = "http://localhost:3001/auth";

const EXTERNAL_ACCOUNT_LABELS = {
  twitter: "Twitter",
  youtube: "YouTube",
  facebook: "Facebook"
};

const ExternalAccount = ({ account }) => {
  if (account.provider === "twitter") {
    return (
      <div className="Twitter">
        <Icon type="twitter" color="blue" />
        <div className="Username">
          <Text size="14px">@{account.username}</Text>
        </div>
        <Icon type="check" />

        <div className="Connected">
          <Text
            color="#53E2AF"
            size="12px"
            letterSpacing="1px"
            casing="uppercase"
          >
            Connected
          </Text>
        </div>

        <style jsx>{`
          .Twitter {
            background-color: #fff;
            border: 1px solid #e7ebf2;
            padding: 14px 22px;
            display: flex;
            align-items: center;
            border-radius: 100px;
            margin-bottom: 14px;
            text-align: left;
          }

          .Connected {
            padding-left: 7px;
          }

          .Username {
            flex: 1;
            padding-left: 14px;
            justify-content: flex-start;
          }
        `}</style>
      </div>
    );
  } else if (account.provider === "facebook") {
    return (
      <div className="Facebook">
        <Icon type="facebook" color="white" />
        <div className="Username">
          <Text size="14px">{account.name}</Text>
        </div>
        <Icon type="check" />

        <div className="Connected">
          <Text
            color="#53E2AF"
            size="12px"
            letterSpacing="1px"
            casing="uppercase"
          >
            Connected
          </Text>
        </div>

        <style jsx>{`
          .Facebook {
            background-color: #fff;
            border: 1px solid #e7ebf2;
            padding: 14px 22px;
            display: flex;
            align-items: center;
            border-radius: 100px;
            margin-bottom: 14px;
            text-align: left;
          }

          .Connected {
            padding-left: 7px;
          }

          .Username {
            flex: 1;
            padding-left: 14px;
            justify-content: flex-start;
          }
        `}</style>
      </div>
    );
  } else {
    return null;
  }
};

class CreateAccount extends React.Component {
  static async getInitialProps({ store, query }) {
    const response = await getVerification(query.id);

    store.dispatch(updateEntities(response.body));
  }

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

  submit = async evt => {
    evt.preventDefault();
    if (this.state.isSubmitting) {
      return;
    }

    this.setState({
      isSubmitting: true
    });

    const {
      email,
      username,
      password,
      passwordConfirmation,
      isSubmitting
    } = this.state;

    createAccount({
      external_authentication_id: this.props.externalAccount.id,
      user: {
        email,
        username,
        password,
        password_confirmation: passwordConfirmation
      }
    })
      .then(response => {
        console.log(response);
        Alert.success("Success!");
        Router.push(`/${username}`);
      })
      .catch(error => {
        console.log(error);
        handleApiError(error);
      })
      .finally(() => {
        this.setState({
          isSubmitting: false
        });
      });
  };

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
              <ExternalAccount account={this.props.externalAccount} />

              <Text size="16px">
                Thanks for verifying with {EXTERNAL_ACCOUNT_LABELS[provider]}!
                Let's get you setup.
              </Text>
            </div>

            <form onSubmit={this.submit}>
              <FormField
                label="email"
                type="email"
                name="email"
                required
                value={email}
                onChange={this.setEmail}
                placeholder="youremail@gmail.com"
              />

              <FormField
                label="username"
                required
                name="username"
                value={username}
                onChange={this.setUsername}
                placeholder="username"
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
            margin-top: 50px;
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
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null,
      externalAccount: state.external_authentication[props.url.query.id]
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(CreateAccount);

export default CreateAccountWithStore;
