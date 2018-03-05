import { Link } from "../routes";
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
import moment from "moment";

const FIELDS = {
  name: "name",
  email: "email",
  birthday: "birthday",
  phone: "phone",
  password: "password",
  passwordConfirmation: "passwordConfirmation",
  location: "location",
  sex: "sex"
};

const getCollapsedFields = externalAuthentication => {
  if (!externalAuthentication) {
    return [];
  }

  const collapsedFields = [];
  if (externalAuthentication.name) {
    collapsedFields.push(FIELDS.name);
  }

  if (externalAuthentication.birthday) {
    collapsedFields.push(FIELDS.birthday);
  }

  if (externalAuthentication.sex) {
    collapsedFields.push(FIELDS.sex);
  }

  if (externalAuthentication.location) {
    collapsedFields.push(FIELDS.location);
  }

  return collapsedFields;
};

const getDefaultInterestedIn = sex => {
  if (sex === "male") {
    return {
      interestedInMen: false,
      interestedInWomen: true,
      interestedInOther: false
    };
  } else if (sex === "female") {
    return {
      interestedInMen: true,
      interestedInWomen: false,
      interestedInOther: false
    };
  } else {
    return {
      interestedInMen: false,
      interestedInWomen: false,
      interestedInOther: false
    };
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
      username: _.get(props, "externalAccount.username", ""),
      name: _.get(props, "externalAccount.name", ""),
      email:
        props.url.query.email ||
        _.get(props, "externalAccount.email", "") ||
        "",
      birthday: _.get(props, "externalAccount.birthday") || "",
      phone: "",
      password: "",
      passwordConfirmation: "",
      location: _.get(props, "externalAccount.location") || "",
      ...getDefaultInterestedIn(_.get(props, "externalAccount.sex") || ""),
      isSubmitting: false,
      sex: _.get(props, "externalAccount.sex") || "",
      termsOfService: false,
      collapsedFields: getCollapsedFields(props.externalAccount)
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
      phone,
      name,
      username,
      password,
      passwordConfirmation,
      isSubmitting,
      location,
      birthday,
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
          isSubmitting: false,
          collapsedFields: []
        });
        return;
      }
    }

    createAccount({
      external_authentication_id: _.get(this.props, "externalAccount.id"),
      profile: {
        latitude: latLng ? latLng.lat : null,
        longitude: latLng ? latLng.lng : null,
        location,
        birthday,
        name,
        phone
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
        this.setState({ collapsedFields: [] });
      })
      .finally(() => {
        this.setState({
          isSubmitting: false
        });
      });
  };

  setBirthday = birthday => this.setState({ birthday });
  setLocation = location => this.setState({ location });
  setEmail = email => this.setState({ email });
  setPhone = phone => this.setState({ phone });
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
      phone,
      username,
      password,
      birthday,
      passwordConfirmation,
      collapsedFields,
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

            <form onSubmit={this.submit}>
              {!collapsedFields.includes(FIELDS.name) && (
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
              )}

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

              <FormField
                label="phone (optional)"
                type="tel"
                required={false}
                icon={<Icon type="phone" size="18px" color="#B9BED1" />}
                name="phone"
                value={phone}
                onChange={this.setPhone}
                placeholder="e.g. 925 555 5555"
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

              {!collapsedFields.includes(FIELDS.birthday) && (
                <FormField
                  label="birthday (age)"
                  type="date"
                  name="birthday"
                  required
                  value={birthday}
                  showBorder={false}
                  onChange={this.setBirthday}
                  placeholder="youremail@gmail.com"
                />
              )}

              {!collapsedFields.includes(FIELDS.sex) && (
                <SexFormField value={sex} onChange={this.setSex} />
              )}

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
