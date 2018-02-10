import VerifyButton from "./VerifyButton";
import { verifyAccount } from "../api";
import _ from "lodash";
import { BASE_AUTHORIZE_URL } from "./SocialLogin";
import Router from "next/router";

export default class VerifyNetworksSection extends React.Component {
  handleSocialLogin = provider => {
    return async login => {
      verifyAccount({
        provider: provider,
        token: login.token.accessToken,
        expiration: login.token.expiresAt,
        application_email: this.props.email
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

  getFacebook = () => {
    return _.last(
      this.props.externalAuthentications.filter(
        auth => auth.provider === "facebook"
      )
    );
  };

  getInstagram = () => {
    return _.last(
      this.props.externalAuthentications.filter(
        auth => auth.provider === "instagram"
      )
    );
  };

  getTwitter = () => {
    return _.last(
      this.props.externalAuthentications.filter(
        auth => auth.provider === "twitter"
      )
    );
  };

  render() {
    const facebook = this.getFacebook();
    const instagram = this.getInstagram();
    const twitter = this.getTwitter();

    return (
      <section>
        <VerifyButton username="+19252008843" provider="phone" />
        <VerifyButton
          provider="facebook"
          username={_.get(facebook, "name")}
          triggerLogin={() => this.onRedirectLogin("facebook")}
          onLogout={this.removeExternalAccount("facebook")}
        />
        <VerifyButton
          provider="instagram"
          username={_.get(instagram, "username")}
          triggerLogin={() => this.onRedirectLogin("instagram")}
          onLogout={this.removeExternalAccount("instagram")}
        />
        <VerifyButton
          provider="twitter"
          username={_.get(twitter, "username")}
          triggerLogin={() => this.onRedirectLogin("twitter")}
          onLogout={this.removeExternalAccount("twitter")}
        />
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
