import SocialLink from "./SocialLink";
import EditSocialLinkModal from "./EditSocialLinkModal";
import { Router } from "../routes";
import { BASE_AUTHORIZE_URL, SUPPORTED_PROVIDERS } from "./SocialLogin";

export default class EditableSocialLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false
    };
  }

  setIsEditing = isEditing => {
    if (SUPPORTED_PROVIDERS.includes(this.props.provider) && this.props.save) {
      this.onRedirectLogin(this.props.provider);
    } else {
      this.setState({ isEditing });
    }
  };

  setURL = url => {
    this.setState({
      isEditing: false
    });

    this.props.setURL(url);
  };

  buildRedirectPath = provider => {
    return `${BASE_AUTHORIZE_URL}/${provider}?redirect_path=${encodeURIComponent(
      window.location.pathname + window.location.search
    )}&from_social_link=true`;
  };

  onRedirectLogin = async provider => {
    const response = await this.props.save(false);
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

  render() {
    const { provider, url = "", setURL } = this.props;

    return (
      <React.Fragment>
        <SocialLink
          onClick={() => this.setIsEditing(true)}
          provider={provider}
          hoverable
          active={!!url}
        />
        <EditSocialLinkModal
          open={this.state.isEditing}
          provider={provider}
          url={url}
          setURL={this.setURL}
          onClose={() => this.setIsEditing(false)}
          isSaving={false}
        />
      </React.Fragment>
    );
  }
}
