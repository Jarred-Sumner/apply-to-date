import Button from "../Button";
import { Router } from "../routes";

export default class InlineApply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.email || ""
    };
  }

  setEmail = evt => this.setState({ email: evt.target.value });

  handleSubmit = evt => {
    evt.preventDefault();

    Router.push({
      pathname: `/${this.props.profileId}/apply`,
      query: {
        email: this.state.email
      }
    });
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
