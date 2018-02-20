import SocialLink from "./SocialLink";
import EditSocialLinkModal from "./EditSocialLinkModal";
import Button from "./Button";
import Icon from "./Icon";
import { Router } from "../routes";
import { BASE_AUTHORIZE_URL, SUPPORTED_PROVIDERS } from "./SocialLogin";

export default class EditableSocialLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false
    };
  }

  shouldRedirect = () =>
    SUPPORTED_PROVIDERS.includes(this.props.provider) &&
    (this.props.allowOAuth || this.props.save || this.props.url === true);

  setIsEditing = isEditing => {
    if (this.shouldRedirect()) {
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
    let redirectPath = this.buildRedirectPath(provider);

    if (this.props.save) {
      const response = await this.props.save(false);
      redirectPath = this.buildRedirectPath(provider);

      if (response) {
        if (_.get(response, "data.type") === "application") {
          const id = _.get(response, "data.id");
          redirectPath =
            redirectPath + `&application_id=${encodeURIComponent(id)}`;
        } else if (_.get(response, "data.type") === "profile") {
          const id = _.get(response, "data.id");
          redirectPath = redirectPath + `&profile_id=${encodeURIComponent(id)}`;
        }
      }
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
      <div className="Container">
        <SocialLink
          onClick={() => this.setIsEditing(true)}
          provider={provider}
          hoverable
          active={!!url}
        />
        {!!url && (
          <div className="SocialLink-connected">
            <Icon color="#fff" type="check" size="12px" />
          </div>
        )}
        {this.shouldRedirect() &&
          !!url && (
            <div className="Button" onClick={() => this.setURL(null)}>
              <Button color="black" circle>
                <Icon type="x" size="12px" />
              </Button>
            </div>
          )}
        {!this.shouldRedirect() && (
          <EditSocialLinkModal
            open={this.state.isEditing}
            provider={provider}
            url={url}
            setURL={this.setURL}
            onClose={() => this.setIsEditing(false)}
            isSaving={false}
          />
        )}
        <style jsx>{`
          .Container {
            position: relative;
            cursor: pointer;
          }

          .SocialLink-connected {
            position: absolute;
            bottom: -4px;
            right: -4px;
            background-color: #0ec2d0;
            border-radius: 50%;
            box-shadow: 0 0 1px #ccc;
            padding: 4px;
            margin: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
            transition: opacity 0.1s linear;
          }

          .Button {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.1s linear;
          }

          .Container:hover .SocialLink-connected {
            opacity: 0;
          }

          .Container:hover .Button {
            opacity: 1;
            pointer-events: all;
          }
        `}</style>
      </div>
    );
  }
}
