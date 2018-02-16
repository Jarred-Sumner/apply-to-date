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
  TOSFormField
} from "../components/FormField";
import Icon from "../components/Icon";
import ExternalAuthentication, {
  EXTERNAL_ACCOUNT_LABELS
} from "../components/ExternalAuthentication";
import Alert, { handleApiError } from "../components/Alert";
import Page from "../components/Page";
import Checkbox from "../components/Checkbox";
import LoginGate from "../components/LoginGate";

const getDefaultUsername = externalAccount => {
  if (externalAccount && externalAccount.username) {
    return externalAccount.username;
  } else {
    return "";
  }
};

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
      username: getDefaultUsername(props.externalAccount),
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
      return Alert.error("To continue, you msut agree to the terms of service");
    }

    this.setState({
      isSubmitting: true
    });

    const {
      email,
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
        location
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
        console.log(response);
        Alert.success("Welcome to ApplyToDate!");
        Router.push(`/${username}/edit`);
      })
      .catch(error => {
        console.error(error);
        handleApiError(error);
      })
      .finally(() => {
        this.setState({
          isSubmitting: false
        });
      });
  };

  setLocation = location => this.setState({ location });
  setEmail = email => this.setState({ email });
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
        <Head title="Create account | ApplyToDate" />
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
                label="email"
                type="email"
                icon={<Icon type="email" size="18px" color="#B9BED1" />}
                name="email"
                required
                value={email}
                onChange={this.setEmail}
                placeholder="youremail@gmail.com"
              />

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

              <FormField
                label="Page"
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

              <SexFormField value={sex} onChange={this.setSex} />

              <FormField
                label="Interested in"
                type="checkbox"
                required
                name="interestedIn"
                onChange={this.setInterestedIn}
                showBorder={false}
                checkboxes={[
                  {
                    checked: interestedInMen,
                    label: "Men",
                    name: "interestedInMen"
                  },
                  {
                    checked: interestedInWomen,
                    label: "Women",
                    name: "interestedInWomen"
                  },
                  {
                    checked: interestedInOther,
                    label: "Other",
                    name: "interestedInOther"
                  }
                ]}
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

              <Button>Create account</Button>
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
      externalAccount: state.external_authentication[props.url.query.id]
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(LoginGate(CreateAccount));

export default CreateAccountWithStore;
