import Text from "./Text";
import Icon from "./Icon";
import SocialIcon from "./SocialIcon";
import classNames from "classnames";
import {Link} from "../routes";
import Button from "./Button";
import TextInput from "./TextInput";

export const EXTERNAL_ACCOUNT_LABELS = {
  twitter: "Twitter",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  phone: "Texting"
};

export const PLACEHOLDER_BY_PROVIDER = {
  twitter: "",
  youtube: "",
  facebook: "",
  instagram: "",
  phone: "e.g. 925-200-5555"
};

const getUsername = account => {
  if (account.provider === "facebook") {
    return account.name;
  } else if (account.provider === "twitter") {
    return `@${account.username}`;
  } else {
    return account.username;
  }
};

class ExternalAccount extends React.Component {
  getLabel = () => {
    const { account, phone = "", provider } = this.props;
    if (provider === "phone") {
      return phone || "";
    } else if (account) {
      return getUsername(account);
    } else {
      return EXTERNAL_ACCOUNT_LABELS[provider];
    }
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.provider !== "phone" &&
      this.props.provider === "phone" &&
      this.inputRef
    ) {
      this.inputRef.focus();
    }
  }

  render() {
    const { account, inline, provider, setPhone, onConnect } = this.props;

    return (
      <div
        className={classNames("Container", {
          "Container--connected": !!account,
          "Container--inline": !!inline,
          "Container--notConnected": !account
        })}
      >
        <TextInput
          icon={<Icon type={provider} color="#CCCCCC" size="18px" />}
          readOnly={provider !== "phone"}
          value={this.getLabel()}
          onChangeText={setPhone}
          placeholder={PLACEHOLDER_BY_PROVIDER[provider]}
          inputRef={inputRef => (this.inputRef = inputRef)}
          inline
          type={provider === "phone" ? "tel" : "text"}
        />

        {provider !== "phone" && (
          <div className="Right">
            <div className="Connected">
              <Icon type="check" color="#53E2AF" size="12px" />

              <Text
                color="#53E2AF"
                size="12px"
                letterSpacing="1px"
                casing="uppercase"
              >
                Connected
              </Text>
            </div>

            <div className="NotConnected">
              <Button
                color={provider}
                onClick={onConnect}
                size="small"
                componentType="div"
              >
                Connect
              </Button>
            </div>
          </div>
        )}

        <style jsx>{`
          .Container {
            background-color: #fff;
            border: 1px solid #e7ebf2;
            padding: 14px 22px;
            display: flex;
            align-items: center;
            width: auto;
            height: 100%;
            flex: 1;
            border-radius: 100px;
            margin-bottom: 14px;
            text-align: left;
          }

          .Container--inline {
            border: 0;
            margin-bottom: 0;
          }

          .Right {
            margin-left: auto;
            margin-top: auto;
            margin-bottom: auto;
          }

          .NotConnected,
          .Connected {
            display: grid;
            align-items: center;
            grid-auto-flow: column dense;
            grid-column-gap: 8px;
            padding-left: 22px;
          }

          .Container--connected .NotConnected {
            display: none;
          }

          .Container--notConnected .Connected {
            display: none;
          }

          .Username {
            flex: 1;
            padding-left: 14px;
            justify-content: flex-start;
          }
        `}</style>
      </div>
    );
  }
}

export default ExternalAccount;
