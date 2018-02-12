import { verifyAccount } from "../api";
import _ from "lodash";
import { BASE_AUTHORIZE_URL } from "./SocialLogin";
import Router from "next/router";
import EditPhoneModal from "./EditPhoneModal";
import ExternalAuthentication, {
  EXTERNAL_ACCOUNT_LABELS
} from "./ExternalAuthentication";
import Select from "./Select";

export default class VerifyNetworksSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: _.get(
        _.last(
          props.externalAuthentications.filter(
            ({ provider }) => provider === "phone"
          )
        ),
        "username",
        ""
      )
    };
  }

  handleSetPhone = phone => this.setState({ phone });

  buildRedirectPath = provider => {
    return `${BASE_AUTHORIZE_URL}/${provider}?redirect_path=${encodeURIComponent(
      window.location.pathname + window.location.search
    )}`;
  };

  onRedirectLogin = async provider => {
    const response = await this.props.save();
    if (!response) {
      return;
    }

    let redirectPath = this.buildRedirectPath(provider);
    if (_.get(response, "data.type") === "application") {
      const id = _.get(response, "data.id");
      redirectPath = redirectPath + `&application_id=${encodeURIComponent(id)}`;
    } else if (_.get(response, "data.type") === "profile") {
      const id = _.get(response, "data.id");
      redirectPath = redirectPath + `&profile_id=${encodeURIComponent(id)}`;
    }

    Router.push(redirectPath);
  };

  removeExternalAccount = toBeRemoved => {
    return () => {
      this.props.setExternalAuthentications(
        this.props.externalAuthentications.filter(
          ({ provider }) => provider !== toBeRemoved
        )
      );
    };
  };

  handleSocialLoginError = provider => {
    return error => {};
  };

  getByProvider = provider => {
    return _.last(
      this.props.externalAuthentications.filter(
        auth => auth.provider === provider
      )
    );
  };

  updateExternalAccount = externalAuthentication => {
    this.props.setExternalAuthentications([
      ...this.props.externalAuthentications,
      externalAuthentication
    ]);
  };

  render() {
    const { whitelist } = this.props;
    const { recommendedContactMethod, phone } = this.state;

    const externalAccount = this.getByProvider(recommendedContactMethod);

    return (
      <section>
        <Select
          name="provider"
          value={recommendedContactMethod}
          inline
          onChange={this.setContactMethod}
          options={whitelist.map(value => ({
            value,
            label: EXTERNAL_ACCOUNT_LABELS[value]
          }))}
          required
        />
        <ExternalAuthentication
          onConnect={() => this.onRedirectLogin(recommendedContactMethod)}
          account={externalAccount}
          inline
          provider={recommendedContactMethod}
          setPhone={this.handleSetPhone}
          phone={phone}
        />
        <style jsx>{`
          section {
            display: flex;
            border: 1px solid #e3e8f0;
            border-radius: 100px;
          }
        `}</style>
      </section>
    );
  }
}
