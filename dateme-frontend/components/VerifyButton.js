import VerifiedFacebookIcon from "../static/Icon/verify/verified/facebook.svg";
import VerifiedPhoneIcon from "../static/Icon/verify/verified/phone.svg";
import VerifiedInstagramIcon from "../static/Icon/verify/verified/instagram.svg";
import VerifiedTwitterIcon from "../static/Icon/verify/verified/twitter.svg";
import PendingFacebookIcon from "../static/Icon/verify/pending/facebook.svg";
import PendingPhoneIcon from "../static/Icon/verify/pending/phone.svg";
import PendingInstagramIcon from "../static/Icon/verify/pending/instagram.svg";
import PendingTwitterIcon from "../static/Icon/verify/pending/twitter.svg";
import Text from "./Text";
import Icon from "./Icon";
import classNames from "classnames";
import Link from "next/link";

const ICON_BY_PROVIDER = {
  facebook: {
    verified: VerifiedFacebookIcon,
    pending: PendingFacebookIcon
  },
  phone: {
    verified: VerifiedPhoneIcon,
    pending: PendingPhoneIcon
  },
  instagram: {
    verified: VerifiedInstagramIcon,
    pending: PendingInstagramIcon
  },
  twitter: {
    verified: VerifiedTwitterIcon,
    pending: PendingTwitterIcon
  }
};

const getVerificationEnum = username => {
  if (username) {
    return "verified";
  } else {
    return "pending";
  }
};

class VerifyButton extends React.Component {
  render() {
    const {
      verificationProvider: provider,
      username,
      triggerLogin,
      onLogout
    } = this.props;

    const isVerified = !!username;
    const PendingIconComponent = ICON_BY_PROVIDER[provider]["pending"];
    const VerifiedIconComponent = ICON_BY_PROVIDER[provider]["verified"];

    return (
      <div
        onClick={isVerified ? onLogout : triggerLogin}
        className={classNames("Container", {
          "Container--verified": getVerificationEnum(isVerified) === "verified",
          "Container--pending": getVerificationEnum(isVerified) === "pending"
        })}
      >
        <div className="PendingIcon">
          <PendingIconComponent width="17px" height="17px" />
        </div>
        <div className="VerifiedIcon">
          <VerifiedIconComponent width="17px" height="17px" />
        </div>

        <div className="Text">
          <Text
            font="sans-serif"
            color="inherit"
            weight="bold"
            size="12px"
            casing="uppercase"
          >
            {isVerified ? `${username}` : `Add ${provider}`}
          </Text>
        </div>

        <div className="ConnectedIcon">
          <Icon type="check" size="12px" />
        </div>

        <div className="RemoveIcon">
          <Icon type="x" size="12px" color="white" />
        </div>

        <style jsx>{`
          .Container {
            text-transform: uppercase;
            display: flex;
            flex-shrink: 0;
            flex-grow: 0;
            flex: 0;
            white-space: nowrap;
            align-items: center;

            padding: 10px 16px;
            border-radius: 100px;
            cursor: pointer;
          }

          .Container--verified:hover .ConnectedIcon,
          .Container--pending .RemoveIcon,
          .Container--verified .RemoveIcon,
          .Container--pending .ConnectedIcon {
            display: none;
          }

          .Container--verified:hover .RemoveIcon {
            display: flex;
          }

          .Container--pending {
            background-color: transparent;
            border: 1px dashed #00e2aa;
            color: #00e2aa;
          }

          .Container--pending:hover,
          .Container--verified {
            background-color: #00e2aa;
            border: 1px dashed transparent;
            color: white;
          }

          .Container--pending .PendingIcon {
            display: flex;
          }

          .Container--pending:hover .VerifiedIcon,
          .Container--verified .VerifiedIcon {
            display: flex;
          }

          .Container--pending:hover .PendingIcon,
          .Container--verified .PendingIcon {
            display: none;
          }

          .Container--pending .VerifiedIcon {
            display: none;
          }

          .Text {
            padding-left: 8px;
            padding-right: 8px;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}

export default class VerifyButtonContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLoginFailure = error => {
    this.props.onLoginError(error);
  };

  handleLoginSuccess = response => {
    this.props.onLoginSuccess(response);
  };

  render() {
    const { provider, ...otherProps } = this.props;

    return (
      <VerifyButton
        {...otherProps}
        verificationProvider={provider}
        provider={provider}
      />
    );
  }
}
