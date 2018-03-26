import Modal, { ConfirmAndCloseButtons } from "../Modal";
import { createDateEvent, swapDate } from "../../api";
import Text from "../Text";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Router } from "../../routes";
import { updateEntities, normalizeApiResponse } from "../../redux/store";
import LoginGate from "../LoginGate";
import {
  getDefaultLocation,
  LOCATIONS_FOR_REGION,
  REGIONS
} from "../../helpers/dateEvent";
import Alert, { handleApiError } from "../Alert";
import moment from "moment";
import { CategoryFormField } from "../FormField";
import { SPACING } from "../../helpers/styles";
import Divider from "../Divider";

class SuggestAnotherDateModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: null,
      isSaving: false
    };
  }

  handleConfirm = () => {
    if (this.state.isSaving) {
      return;
    }

    if (!this.state.category) {
      Alert.error("Please choose what you want to do");
      return;
    }

    this.setState({
      isSaving: true
    });

    const { category } = this.state;
    const { dateEvent, dateEventApplication } = this.props;

    swapDate(dateEvent.id, dateEventApplication.id, category)
      .then(response => {
        this.setState({ isSaving: false });
        this.props.updateEntities(response.body);

        const body = normalizeApiResponse(response.body);

        this.setState({
          isSaving: false
        });

        this.props.onHide();
      })
      .catch(exception => {
        handleApiError(exception);
        this.setState({
          isSaving: false
        });
      });
  };
  handleChangeCategory = category => this.setState({ category });

  render() {
    const { open, isSaving, category } = this.state;
    const { currentProfile, onHide, dateEventApplication } = this.props;
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onHide}
        renderHeader={() => (
          <Text weight="semiBold" lineHeight="18px" size="18px">
            Suggest another date
          </Text>
        )}
        renderFooter={() => (
          <ConfirmAndCloseButtons
            onConfirm={this.handleConfirm}
            onCancel={this.props.onHide}
            isConfirmPending={this.state.isSaving}
          />
        )}
      >
        <div className="Container">
          <CategoryFormField
            label="What do you want to do instead?"
            value={category}
            onChange={this.handleChangeCategory}
          />

          <Divider height={`${SPACING.NORMAL}px`} color="transparent" />

          <Text size="14px">
            This will match you with {dateEventApplication.name} and add them to{" "}
            <a target="_blank" href="/applications">
              applications
            </a>, so you can go on a different date with them later.
          </Text>

          <style jsx>{`
            .Container {
              display: flex;
              flex-direction: column;
              max-width: 500px;
              padding: ${SPACING.LARGE}px;
            }
          `}</style>
        </div>
      </Modal>
    );
  }
}

const ConnectedModal = connect(null, dispatch =>
  bindActionCreators({ updateEntities }, dispatch)
)(SuggestAnotherDateModal);

export default LoginGate(ConnectedModal);
