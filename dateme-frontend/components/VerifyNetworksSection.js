import { verifyAccount } from "../api";
import _ from "lodash";
import { BASE_AUTHORIZE_URL } from "./SocialLogin";
import Router from "next/router";
import EditPhoneModal from "./EditPhoneModal";
import ExternalAuthentication from "./ExternalAuthentication";

const EditableExternalAuthentication = ({
  account,
  provider,
  username,
  onLogout,
  triggerLogin
}) => {
  return (
    <ExternalAuthentication
      onConnect={triggerLogin}
      account={account}
      provider={provider}
    />
  );
};

export default class VerifyNetworksSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditingPhone: false
    };
  }

  stopEditingPhone = () => this.setState({ isEditingPhone: false });
  handleSocialLogin = provider => {
    return async login => {
      verifyAccount({
        provider: provider,
        token: login.token.accessToken,
        expiration: login.token.expiresAt,
        application_email: this.props.email || null
      }).then(response => {
        const auths = [
          ...this.props.externalAuthentications,
          response.body.data
        ];
        this.props.setExternalAuthentications(auths);
      });
    };
  };

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
    const facebook = this.getByProvider("facebook");
    const instagram = this.getByProvider("instagram");
    const twitter = this.getByProvider("twitter");
    const phone = this.getByProvider("phone");
    const { whitelist } = this.props;

    return (
      <section>
        {whitelist.includes("phone") && (
          <React.Fragment>
            <EditableExternalAuthentication
              account={phone}
              triggerLogin={() => this.setState({ isEditingPhone: true })}
              onLogout={() => this.setState({ isEditingPhone: true })}
              provider="phone"
            />
            <EditPhoneModal
              open={this.state.isEditingPhone}
              onRemove={this.removeExternalAccount("phone")}
              onUpdate={this.updateExternalAccount}
              onClose={this.stopEditingPhone}
            />
          </React.Fragment>
        )}
        {whitelist.includes("facebook") && (
          <EditableExternalAuthentication
            account={facebook}
            provider="facebook"
            triggerLogin={() => this.onRedirectLogin("facebook")}
            onLogout={this.removeExternalAccount("facebook")}
          />
        )}
        {whitelist.includes("instagram") && (
          <EditableExternalAuthentication
            account={instagram}
            provider="instagram"
            triggerLogin={() => this.onRedirectLogin("instagram")}
            onLogout={this.removeExternalAccount("instagram")}
          />
        )}
        {whitelist.includes("twitter") && (
          <EditableExternalAuthentication
            account={twitter}
            provider="twitter"
            triggerLogin={() => this.onRedirectLogin("twitter")}
            onLogout={this.removeExternalAccount("twitter")}
          />
        )}
        <style jsx>{`
          section {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 24px;
          }
        `}</style>
      </section>
    );
  }
}
