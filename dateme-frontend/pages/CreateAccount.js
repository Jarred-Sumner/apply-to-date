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
import FormField, {
  geocodeByAddress,
  getLatLng,
  SexFormField,
  TOSFormField,
  UsernameFormField,
  PasswordFormField,
  InterestedInFormField
} from "../components/FormField";
import Icon from "../components/Icon";
import ExternalAuthentication, {
  EXTERNAL_ACCOUNT_LABELS
} from "../components/ExternalAuthentication";
import Alert, { handleApiError } from "../components/Alert";
import Page from "../components/Page";
import Checkbox from "../components/Checkbox";
import LoginGate from "../components/LoginGate";
import withLogin from "../lib/withLogin";
import { buildEditProfileURL } from "../lib/routeHelpers";
import { logEvent } from "../lib/analytics";

class CreateAccount extends React.Component {
  static async getInitialProps({ store, query }) {
    if (query.id) {
      const response = await getVerification(query.id);

      store.dispatch(updateEntities(response.body));
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      email: this.props.url.query.email || "",
      username: _.get(props, "externalAccount.username", ""),
      name: _.get(props, "externalAccount.name", ""),
      email: _.get(props, "externalAccount.email", ""),
      password: "",
      passwordConfirmation: "",
      location: "",
      interestedInMen: false,
      interestedInWomen: false,
      interestedInOther: false,
      isSubmitting: false,
      sex: "",
      termsOfService: false
    };
  }

  submit = async evt => {
    evt.preventDefault();
    if (this.state.isSubmitting) {
      return;
    }

    if (!this.state.termsOfService) {
      return Alert.error("To continue, you must agree to the terms of service");
    }

    this.setState({
      isSubmitting: true
    });

    const {
      email,
      name,
      username,
      password,
      passwordConfirmation,
      isSubmitting,
      location,
      sex,
      interestedInMen,
      interestedInWomen,
      interestedInOther
    } = this.state;

    let latLng;
    if (location) {
      try {
        latLng = await geocodeByAddress(location).then(results =>
          getLatLng(results[0])
        );
      } catch (exception) {
        console.error(exception);
        Alert.error("Please re-enter your location and try again");
        this.setState({
          isSubmitting: false
        });
        return;
      }
    }

    createAccount({
      external_authentication_id: _.get(this.props, "externalAccount.id"),
      profile: {
        latitude: latLng ? latLng.lat : null,
        longitude: latLng ? latLng.lat : null,
        location,
        name
      },
      user: {
        email,
        username,
        password,
        sex,
        interested_in_men: interestedInMen,
        interested_in_women: interestedInWomen,
        interested_in_other: interestedInOther,
        password_confirmation: passwordConfirmation
      }
    })
      .then(response => {
        Router.push(buildEditProfileURL(username));
        logEvent("Create Account", {
          providers: [_.get(this, "props.externalAccount.provider")],
          sex,
          interested_in_men: interestedInMen,
          interested_in_women: interestedInWomen,
          interested_in_other: interestedInOther,
          type: "dating",
          from_application: false
        });
      })
      .catch(error => {
        console.error(error);
        handleApiError(error);
        logEvent("Create Account Error");
      })
      .finally(() => {
        this.setState({
          isSubmitting: false
        });
      });
  };

  setLocation = location => this.setState({ location });
  setEmail = email => this.setState({ email });
  setName = name => this.setState({ name });
  setUsername = username => this.setState({ username });
  setPassword = password => this.setState({ password });
  setPasswordConfirmation = passwordConfirmation =>
    this.setState({ passwordConfirmation });
  setInterestedIn = (name, isInterested) => {
    this.setState({
      [name]: !!isInterested
    });
  };

  setSex = sex => {
    this.setState({ sex });
  };

  render() {
    const { provider, id } = this.props.url.query;
    const {
      email,
      name,
      username,
      password,
      passwordConfirmation,
      isSubmitting,
      location,
      interestedInMen,
      interestedInWomen,
      interestedInOther,
      sex
    } = this.state;

    return (
      <div>
        <Head
          title="Create account | Apply to Date"
          description="Sign up to Apply to Date and get a personal page where people apply to go on a date with you."
        />
        <Page>
          <main>
            <Text type="PageTitle">Create account</Text>

            {this.props.externalAccount && (
              <div className="Row">
                <ExternalAuthentication
                  account={this.props.externalAccount}
                  provider={provider}
                />

                <Text size="16px">
                  Thanks for verifying with {EXTERNAL_ACCOUNT_LABELS[provider]}!
                  Let's get you setup.
                </Text>
              </div>
            )}

            <form onSubmit={this.submit}>
              <FormField
                label="Name"
                type="text"
                icon={<Icon type="user" size="18px" color="#B9BED1" />}
                name="name"
                required
                value={name}
                onChange={this.setName}
                placeholder="e.g. Luke Miles"
              />

              <UsernameFormField value={username} onChange={this.setUsername} />

              <FormField
                label="email"
                type="email"
                icon={<Icon type="email" size="18px" color="#B9BED1" />}
                name="email"
                required
                value={email}
                onChange={this.setEmail}
                placeholder="youremail@gmail.com"
              />

              <PasswordFormField
                required
                value={password}
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

              <SexFormField value={sex} onChange={this.setSex} />

              <InterestedInFormField
                interestedInMen={interestedInMen}
                interestedInWomen={interestedInWomen}
                interestedInOther={interestedInOther}
                required
                onChange={this.setInterestedIn}
              />

              <FormField
                label="location"
                type="location"
                required
                name="location"
                value={location}
                onChange={this.setLocation}
                placeholder="e.g. San Francisco, CA"
              />

              <TOSFormField
                onChange={(name, value) => this.setState({ [name]: value })}
                checked={this.state.termsOfService}
              />

              <Button pending={this.state.isSubmitting}>Create account</Button>
            </form>
          </main>
        </Page>
        <style jsx>{`
          main {
            margin-top: 50px;
            display: grid;
            grid-template-rows: auto auto auto;
            grid-row-gap: 30px;
            justify-content: center;
            text-align: center;
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
      externalAccount: state.external_authentication[props.url.query.id]
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(LoginGate(CreateAccount));

export default CreateAccountWithStore;
