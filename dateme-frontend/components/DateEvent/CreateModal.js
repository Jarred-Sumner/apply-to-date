import Modal, { ConfirmAndCloseButtons } from "../Modal";
import { createDateEvent } from "../../api";
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

class CreateDateEventModal extends React.Component {
  constructor(props) {
    super(props);

    const location = getDefaultLocation({
      locations: LOCATIONS_FOR_REGION[props.currentProfile.region],
      latitude: props.currentUser.latitude,
      longitude: props.currentUser.longitude
    });

    this.state = {
      category: null,
      summary: "",
      isSaving: false,
      location,
      occursOnDay: moment()
        .startOf("day")
        .add(1, "day")
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

    createDateEvent({
      occursOnDay,
      category,
      location,
      summary,
      region: this.props.region
    })
      .then(response => {
        this.setState({ isSaving: false });
        this.props.updateEntities(response.body);

        const body = normalizeApiResponse(response.body);
        const dateEvent = _.first(_.values(body.date_event));

        if (dateEvent) {
          this.props.onHide();
          Router.pushRoute(cdateEvent.url);
        }
      })
      .catch(exception => {
        handleApiError(exception);
        this.setState({
          isSaving: false
        });
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
            Create date
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
      </Modal>
    );
  }
}

const ConnectedModal = connect(null, dispatch =>
  bindActionCreators({ updateEntities }, dispatch)
)(CreateDateEventModal);

export default LoginGate(ConnectedModal);
