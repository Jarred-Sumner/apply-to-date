import Modal, { ConfirmAndCloseButtons } from "./Modal";
import FormField from "./FormField";
import { is } from "is-social";
import Text from "./Text";
import SocialIcon from "./SocialIcon";
import Button from "./Button";
import SocialLink from "./SocialLink";
import Alert from "./Alert";
import _ from "lodash";

const LINKEDIN_REGEX = /((https?:\/\/)?((www|\w\w)\.)?linkedin\.com\/)((([\w]{2,3})?)|([^\/]+\/(([\w|\d-&#?=])+\/?){1,}))$/;

const URL_ONLY_PROVIDERS = ["linkedin", "facebook"];

const LABEL_BY_PROVIDER = {
  snapchat: "Add Snapchat",
  facebook: "Add Facebook",
  medium: "Add Medium",
  instagram: "Add Instagram",
  linkedin: "Add LinkedIn",
  dribbble: "Add Dribbble",
  twitter: "Add Twitter",
  youtube: "Add YouTube",
  quora: "Add Quora"
};

const PLACEHOLDER_BY_PROVIDER = {
  facebook:
    "facebook url e.g. https://facebook.com/facebook.username (full url)",
  snapchat: "snapchat username e.g. snapchat.username (no @ sign)",
  instagram: "instagram username e.g. jarredsumner (no @ sign)",
  linkedin:
    "linkedin url e.g. https://www.linkedin.com/in/jarred-sumner-a8772425/ (full url)",
  dribbble: "dribbble username e.g. username",
  medium: "medium username e.g. @jarredsumner",
  twitter: "twitter handle e.g. @jarredsumner",
  youtube: "youtube username e.g. jarredsumner",
  quora: "quora username e.g. Lucy-Guo"
};

const DEFAULT_BY_PROVIDER = {
  facebook: "https://facebook.com/",
  twitter: "@",
  medium: "@",
  quora: "https://quora.com/profile/"
};

const isProfileValid = (url, provider) => {
  if (provider === "facebook") {
    return true;
  } else if (provider === "youtube") {
    return is.youtube.name(url);
  } else if (provider === "twitter" || provider === "medium") {
    return is.twitter.handle(url, { at: true });
  } else if (provider === "instagram") {
    return is.instagram.name(url);
  } else if (provider === "snapchat") {
    return (
      url.length >= 3 &&
      url.length <= 15 &&
      !url.includes(" ") &&
      !url.includes("/")
    );
  } else if (provider === "linkedin") {
    return LINKEDIN_REGEX.test(url);
  } else {
    return true;
  }
};

export default class EditSocialLinkModal extends React.Component {
  constructor(props) {
    super(props);

    const { url = "", provider } = props;

    if (!url) {
      this.state = {
        url: DEFAULT_BY_PROVIDER[provider] || ""
      };

      return;
    }

    const normalizedUrl = URL_ONLY_PROVIDERS.includes(provider)
      ? url
      : _.last((url || "").split("/"));

    this.state = {
      url: normalizedUrl
    };
  }

  moveCaretToEnd = evt => {
    const temp = evt.target.value;
    evt.target.value = "";
    evt.target.value = temp;
  };

  onChangeURL = url => this.setState({ url });

  handleConfirm = evt => {
    evt.preventDefault();

    const { provider, setURL } = this.props;
    const { url } = this.state;

    if (_.isEmpty(url)) {
      setURL(null);
    } else {
      setURL(url);
    }
  };

  render() {
    const { provider } = this.props;
    const { url } = this.state;

    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        little
        overlayColor="rgba(255,255,255, 0.75)"
      >
        <div className="container">
          <div className="Icon">
            <SocialLink
              provider={provider}
              active
              width={"60px"}
              height={"60px"}
            />
          </div>
          <form onSubmit={this.handleConfirm}>
            <FormField
              type={URL_ONLY_PROVIDERS.includes(provider) ? "url" : "text"}
              placeholder={PLACEHOLDER_BY_PROVIDER[provider]}
              name={provider}
              autoFocus
              onFocus={this.moveCaretToEnd}
              autoCorrect={false}
              autoCapitalize={false}
              onChange={this.onChangeURL}
              value={url}
            />
          </form>

          <Button onClick={this.handleConfirm}>
            {LABEL_BY_PROVIDER[provider]}
          </Button>
        </div>

        <style jsx>{`
          .container {
            display: grid;
            grid-auto-flow: row;
            grid-auto-rows: 72px auto auto auto;
            margin: 24px 48px;
            grid-row-gap: 24px;
          }

          .Icon,
          .Text {
            margin-left: auto;
            margin-right: auto;
          }

          @media (min-width: 500px) {
            .container {
              min-width: 350px;
            }
          }
        `}</style>
      </Modal>
    );
  }
}
