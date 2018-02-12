import Icon from "./Icon";
import onClickOutside from "react-onclickoutside";
import classNames from "classnames";
import Text from "./Text";
import Button from "./Button";

class FeedbackForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
      message: "",
      isSaving: false,
      hasSaved: false
    };
  }

  handleClickOutside = () => this.setState({ isExpanded: false });

  setExpanded = isExpanded => {
    this.setState({ isExpanded });
    if (isExpanded && this.inputRef) {
      this.inputRef.focus();
    }
  };
  handleCancel = () => this.setState({ isExpanded: false });
  handleSubmit = evt => {
    evt.preventDefault();
  };

  handleMessageChange = evt => this.setState({ message: evt.target.value });

  render() {
    const { isExpanded, message } = this.state;

    return (
      <div className="Container" onClick={() => this.setExpanded(true)}>
        <div
          className={classNames("FeedbackForm", {
            "FeedbackForm--expanded": isExpanded,
            "FeedbackForm--collapsed": !isExpanded
          })}
        >
          <div className="FeedbackForm-placeholder">
            <div className="Icon">
              <Icon type="feedback" size="16px" color="#B9BED1" />
            </div>

            <Text color="#B9BED1" size="12px" lineHeight="19px">
              Have feedback or questions?
            </Text>
          </div>

          <form
            className="FeedbackForm-input"
            onClick={evt => evt.stopPropagation()}
            onSubmit={this.handleSubmit}
          >
            <textarea
              required
              name="feedback"
              value={message}
              ref={inputRef => (this.inputRef = inputRef)}
              placeholder="Have feedback or questions?"
              onChange={this.handleMessageChange}
            />

            <Text size="14px" color="#3B55E6">
              Your feedback is sent directly to the founders.
            </Text>

            <div className="FeedbackForm-inputButtons">
              <Button color="black" fill={false} size="small">
                Cancel
              </Button>
              <Button color="black" size="small">
                Send feedback
              </Button>
            </div>
          </form>
        </div>

        <style jsx>{`
          .Container {
            display: flex;
            position: relative;
          }

          .FeedbackForm-placeholder,
          .FeedbackForm-input {
            display: flex;

            transition: 0.2s opacity linear;
            border-radius: 4px;
          }

          .FeedbackForm-input {
            position: absolute;
            top: 0;
            right: 0;

            display: grid;
            grid-template-rows: 3fr 1fr 1fr;
            grid-row-gap: 6px;
            width: max-content;

            padding: 14px 22px;
            background-color: white;
            border: 1px solid #e9ebf5;
            box-shadow: 0 0 20px 0 rgba(161, 166, 187, 0.35);
          }

          textarea {
            margin: -14px -22px;
            padding: 14px 22px;
            font-family: "Open Sans", sans-serif;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            font-size: 14px;
            color: #333;
            line-height: 18px;
            appearance: none;
            border: 0;
            resize: none;
            outline: none;
            box-shadow: none;
          }

          .FeedbackForm-placeholder {
            background-color: #fcfcfc;
            align-items: center;
            padding: 7px 14px;
            justify-content: center;
            border: 1px solid #e9ebf5;
          }

          .FeedbackForm-inputButtons {
            display: flex;
            justify-content: space-between;
          }

          .Icon {
            margin-right: 8px;
          }

          .FeedbackForm--expanded .FeedbackForm-placeholder {
            opacity: 0;
            pointer-events: none;
          }

          .FeedbackForm--collapsed .FeedbackForm-input {
            opacity: 0;
            pointer-events: none;
          }

          @media (max-width: 460px) {
            .Container {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default onClickOutside(FeedbackForm);
