import Button from "../Button";
import { Router } from "../../routes";
import SocialLink from "../SocialLink";
import Icon from "../Icon";
import Text from "../Text";
import TextInput from "../TextInput";
import { BASE_AUTHORIZE_URL } from "../SocialLogin";
import qs from "qs";
import { isMobile } from "../../lib/Mobile";

const STATUS = {
  email: "email",
  social: "social"
};

class EmailForm extends React.Component {
  handleSubmit = evt => {
    evt.preventDefault();
    this.props.onApply();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextInput
          type="email"
          name="email"
          className="InlineApply-TextInput"
          required
          icon={<Icon type="email" size="16px" color="#CCC" />}
          autoComplete="email"
          onChangeText={this.props.setEmail}
          placeholder="Your email"
          value={this.props.email}
          inline={!isMobile()}
        />

        <Button
          className="InlineApply-Button"
          componentType="button"
          inline={!isMobile()}
        >
          Apply for a date
        </Button>

        <style jsx>{`
          form {
            display: flex;
            border: 1px solid #f0f2f7;
            padding-left: 24px;
            border-radius: 100px;
          }

          @media (max-width: 500px) {
            form {
              flex-direction: column;
              padding-left: 0;
              border-radius: 6px;
            }

            form :global(.InlineApply-TextInput) {
              height: 100%;
              padding-top: 14px;
              padding-left: 14px;
              padding-bottom: 14px;

              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
            }

            form :global(.InlineApply-Button) {
              border-top-left-radius: 0;
              border-top-right-radius: 0;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
              padding-top: 14px;
              padding-bottom: 14px;
            }
          }
        `}</style>
      </form>
    );
  }
}

class SocialNetworkForm extends React.Component {
  render() {
    return (
      <div className="Container">
        <Icon type="pending-verify" size="62px" color="#000" />

        <Text size="14px">
          To finish applying, please connect a social profile to verify your
          identity.
        </Text>

        <div className="SocialLinkGroup">
          <SocialLink
            hoverable
            provider="instagram"
            width="42px"
            height="42px"
            active
            onClick={() => this.props.loginWith("instagram")}
          />
          <SocialLink
            hoverable
            provider="facebook"
            width="42px"
            height="42px"
            active
            onClick={() => this.props.loginWith("facebook")}
          />
          <SocialLink
            hoverable
            provider="twitter"
            width="42px"
            height="42px"
            active
            onClick={() => this.props.loginWith("twitter")}
          />
        </div>

        <style jsx>{`
          .Container {
            display: grid;
            grid-auto-flow: row;
            grid-template-rows: auto auto auto;
            grid-row-gap: 24px;

            max-width: 300px;
            padding: 24px;
            justify-content: center;
            align-items: center;
            border: 1px solid #f0f2f7;
            border-radius: 4px;

            grid-row: auto;
            margin-left: auto;
            margin-right: auto;
          }

          .SocialLinkGroup {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-shrink: 0;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}

export default class InlineApplication extends React.Component {
  constructor(props) {
    super(props);

    const email = props.email || "";
    this.state = {
      email,
      status: email ? STATUS.social : STATUS.email
    };
  }

  setEmail = email => this.setState({ email });

  handleLoginWith = provider => {
    const params = qs.stringify({
      applicant_email: this.state.email,
      profile_id: this.props.profileId
    });

    const url = `${BASE_AUTHORIZE_URL}/${provider}?${params}`;
    console.log(url);
    Router.pushRoute(url, url);
  };

  render() {
    const { status, email } = this.state;

    if (status === STATUS.email) {
      return (
        <EmailForm
          email={email}
          setEmail={this.setEmail}
          onApply={() =>
            this.setState({
              status: STATUS.social
            })
          }
        />
      );
    } else {
      return <SocialNetworkForm loginWith={this.handleLoginWith} />;
    }
  }
}
