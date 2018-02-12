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
import Button from "./Button";

export const ICON_BY_PROVIDER = {
  facebook: {
    verified: VerifiedFacebookIcon
  },
  phone: {
    verified: VerifiedPhoneIcon
  },
  instagram: {
    verified: VerifiedInstagramIcon
  },
  twitter: {
    verified: VerifiedTwitterIcon
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
    const VerifiedIconComponent = ICON_BY_PROVIDER[provider]["verified"];

    return (
      <Button
        onClick={triggerLogin}
        color={provider}
        size="small"
        icon={<VerifiedIconComponent width="17px" height="17px" />}
      >
        Connect
      </Button>
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
