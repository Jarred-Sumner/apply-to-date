import Button from "../Button";
import Router from "../../routes";
import SocialLink from "../SocialLink";
import Icon from "../Icon";
import Text from "../Text";

const STATUS = {
  email: "email",
  social: "social"
};

class EmailForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.email || ""
    };
  }

  setEmail = evt => this.setState({ email: evt.target.value });

  handleSubmit = evt => {
    evt.preventDefault();
    this.props.setEmail(this.state.email);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          onChange={this.setEmail}
          placeholder="Your email"
          value={this.state.email}
        />
        <Button componentType="button" inline>
          Apply for a date
        </Button>

        <style jsx>{`
          form {
            display: flex;
            height: 42px;
          }

          input {
            font-size: 14px;
            padding: 14px 22px;
            border-radius: 33px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border: 1px solid #bababa;
            border-right: 0px;
            line-height: 18px;
            color: #000;
            outline: none;
            width: auto;
            display: flex;
            flex: 1;
          }

          input::-webkit-input-placeholder {
            color: #c5cbd4;
          }

          input:focus {
            border-color: #b0b0b0;
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
          <SocialLink provider="instagram" size="42px" />
          <SocialLink provider="facebook" size="42px" />
          <SocialLink provider="twitter" size="42px" />
        </div>

        <style jsx>{`
          .Container {
            display: grid;
            grid-auto-flow: row dense;
            grid-template-rows: 62px auto 20px;
            grid-row-gap: 14px;

            max-width: 314px;
            padding: 12px 24px;
            justify-content: center;
            align-items: center;
            border: 1px solid #f0f2f7;
          }

          .SocialLinkGroup {
            display: flex;
            justify-content: space-between;
          }
        `}</style>
      </div>
    );
  }
}

export default class InlineApplication extends React.Component {}
