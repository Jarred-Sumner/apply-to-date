import Modal, { ConfirmAndCloseButtons } from "../Modal";
import { updateDateEvent, hideDateEvent } from "../../api";
import Text from "../Text";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Router } from "../../routes";
import { updateEntities, normalizeApiResponse } from "../../redux/store";
import LoginGate from "../LoginGate";
import UpdateDateEvent from "./UpdateDateEvent";
import {
  getDefaultLocation,
  LOCATIONS_FOR_REGION,
  REGIONS
} from "../../helpers/dateEvent";
import Alert, { handleApiError } from "../Alert";
import moment from "moment";
import { COLORS, SPACING } from "../../helpers/styles";
import Divider from "../Divider";

class EditDateEventModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: props.dateEvent.category,
      summary: props.dateEvent.summary || "",
      isSaving: false,
      location: props.dateEvent.location,
      occursOnDay: moment(props.dateEvent.occursOnDay)
        .toDate()
        .toISOString()
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

    if (!this.state.occursOnDay || this.state.occursOnDay === "custom") {
      Alert.error("Please choose a day");
      return;
    }

    if (!this.state.location) {
      Alert.error("Please choose the general location");
      return;
    }

    this.setState({
      isSaving: true
    });

    const { occursOnDay, category, location, summary } = this.state;

    updateDateEvent({
      occursOnDay,
      category,
      location,
      id: this.props.dateEvent.id,
      summary,
      region: this.props.dateEvent.region
    })
      .then(response => {
        this.setState({ isSaving: false });
        this.props.updateEntities(response.body);

        const body = normalizeApiResponse(response.body);
        const dateEvent = _.first(_.values(body.date_event));

        Alert.success("Saved.");
        this.props.onHide();
      })
      .catch(exception => {
        handleApiError(exception);
        this.setState({
          isSaving: false
        });
      });
  };

  handleCancelDate = () => {
    hideDateEvent(this.props.dateEvent.id)
      .then(response => this.props.updateEntities(response.body))
      .then(() => {
        Alert.success("Canceled.");
        this.props.onHide();
      });
  };
  handleChangeSummary = summary => this.setState({ summary });
  handleChangeCategory = category => this.setState({ category });
  handleChangeLocation = location => this.setState({ location });
  handleChangeOccursOnDay = occursOnDay => this.setState({ occursOnDay });

  render() {
    const {
      open,
      onClose,
      isSaving,
      location,
      summary,
      category,
      occursOnDay
    } = this.state;
    const { currentProfile } = this.props;
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onHide}
        renderHeader={() => (
          <Text weight="semiBold" lineHeight="18px" size="18px">
            Edit date
          </Text>
        )}
        renderFooter={() => (
          <ConfirmAndCloseButtons
            onConfirm={this.handleConfirm}
            showCancel={false}
            confirmLabel="Save changes"
            isConfirmPending={this.state.isSaving}
          />
        )}
      >
        <UpdateDateEvent
          location={location}
          locations={_.keys(LOCATIONS_FOR_REGION[currentProfile.region])}
          onChangeLocation={this.handleChangeLocation}
          summary={summary}
          onChangeSummary={this.handleChangeSummary}
          category={category}
          onChangeCategory={this.handleChangeCategory}
          occursOnDay={occursOnDay}
          onChangeOccursOnDay={this.handleChangeOccursOnDay}
        />

        <div className="Cancel">
          <Text onClick={this.handleCancelDate} type="link">
            Cancel date
          </Text>
        </div>

        <style jsx>{`
          .Cancel {
            padding-left: ${SPACING.LARGE}px;
            padding-right: ${SPACING.LARGE}px;
            margin-bottom: ${SPACING.NORMAL}px;
          }
        `}</style>
      </Modal>
    );
  }
}

const ConnectedModal = connect(null, dispatch =>
  bindActionCreators({ updateEntities }, dispatch)
)(EditDateEventModal);

export default LoginGate(ConnectedModal);
