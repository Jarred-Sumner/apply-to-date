import Button from "./Button";
import Modal from "./Modal";
import FormField from "./FormField";
import Text from "./Text";
import { ICON_BY_PROVIDER } from "./VerifyButton";
import { verifyAccount } from "../api";
import _ from "lodash";
import Alert, { handleApiError } from "./Alert";

const PhoneIcon = ICON_BY_PROVIDER["phone"]["verified"];

export default class EditPhoneModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: this.props.phone || "",
      isSaving: false
    };
  }

  handleConfirm = async evt => {
    evt.preventDefault();
    const { phone, isSaving } = this.state;

    if (isSaving) {
      return;
    }

    if (_.isEmpty(phone)) {
      this.props.onRemove();
      return;
    }

    this.setState({
      isSaving: true
    });

    verifyAccount({
      provider: "phone",
      token: this.state.phone
    })
      .then(response => {
        const id = _.get(response, "body.data.id");
        if (id) {
          this.props.onUpdate(id);
          this.props.onClose();
        } else {
          handleApiError(response);
        }
      })
      .catch(error => handleApiError(error))
      .finally(() => this.setState({ isSaving: false }));
  };

  onChangePhone = phone => this.setState({ phone });

  render() {
    const { provider } = this.props;
    const { phone, isSaving } = this.state;

    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        little
        overlayColor="rgba(255,255,255, 0.75)"
      >
        <div className="container">
          <div className="Icon">
            <PhoneIcon width={"36px"} height={"36px"} />
          </div>
          <div className="Text">
            <Text type="title">Add your phone</Text>
          </div>
          <form onSubmit={this.handleConfirm}>
            <FormField
              type={"tel"}
              name="tel"
              placeholder={"e.g. +1 (925) 555 5555"}
              name="tel"
              autoFocus
              autoCorrect={false}
              autoCapitalize={false}
              onChange={this.onChangePhone}
              value={phone}
            />
          </form>

          <Button pending={isSaving} onClick={this.handleConfirm}>
            Done
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

          .Icon {
            background-color: #333;
            padding: 18px;
            border-radius: 50%;
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
