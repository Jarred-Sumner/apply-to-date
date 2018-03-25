import {
  updateEntities,
  newDateEventsSelector,
  currentUserSelector,
  dateEventsByRegionSelector,
  dateEventsPendingRSVPSelector,
  upcomingDateEventApplicationsSelector,
  currentUserDateEventApplicationsByDateEventId,
  approvedDateEventApplicationsByDateEventID,
  upcomingDateEventsSelector,
  dateEventApplicationsByDateEventID,
  initStore,
  currentRegionSelector,
  dateEventSelector,
  canCurrentUserCreateDateEventsSelector
} from "../redux/store";
import {
  getDateEvents,
  getAppliedDateEvents,
  getPendingDateEvents,
  getDateEvent
} from "../api";
import _ from "lodash";
import Head from "../components/head";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import LoginGate from "../components/LoginGate";
import { bindActionCreators } from "redux";
import Text from "../components/Text";
import Icon from "../components/Icon";
import InlineApply from "../components/profile/InlineApply";
import titleCase from "title-case";
import Waypoint from "react-waypoint";
import Button from "../components/Button";
import Thumbnail from "../components/Thumbnail";
import PageFooter from "../components/PageFooter";
import Page from "../components/Page";
import SocialLinkList from "../components/SocialLinkList";
import MessageBar from "../components/MessageBar";
import PhotoGroup from "../components/PhotoGroup";
import Typed from "react-typed";
import withLogin from "../lib/withLogin";
import { Router } from "../routes";
import {
  buildProfileURL,
  buildEditProfileURL,
  buildMobileViewProfileURL
} from "../lib/routeHelpers";
import { getMobileDetect } from "../lib/Mobile";
import {
  getApplicantStatus,
  REGIONS,
  REGION_LABELS,
  getCreatorStatus
} from "../helpers/dateEvent";
import Sidebar from "../components/DateEventApplication/Sidebar";
import { SPACING } from "../helpers/styles";

const getInitialDateEventId = props => {
  const { dateEventApplications = [], dateEvent } = props;
  if (!dateEvent || !dateEventApplications) {
    return {};
  }

  return {
    dateEventApplicationId: _.first(dateEventApplications).id,
    dateEventId: dateEvent.id
  };
};

class DateEventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  async componentDidMount() {
    await this.loadDateEvents();

    if (!this.props.selectedApplicationId) {
      if (getInitialDateEventId(this.props).dateEventApplicationId) {
        const { dateEventApplicationId, dateEventId } = getInitialDateEventId(
          this.props
        );

        Router.replaceRoute(
          `/dates/${dateEventId}/pick-someone/${dateEventApplicationId}`
        );
      }
    }
  }

  loadDateEvents = () => {
    this.setState({
      isLoading: true
    });

    const { dateEventId } = this.props.url.query;

    return getDateEvent(dateEventId)
      .then(response => {
        this.props.updateEntities(response.body);

        return response.body.data.id;
      })
      .then(dateEventId => {
        return getAppliedDateEvents([dateEventId]);
      })
      .then(response => this.props.updateEntities(response.body))
      .catch(error => console.error(error))
      .finally(() => this.setState({ isLoading: false, isRefreshing: false }));
  };

  render() {
    const { dateEvent, dateEventApplications, currentApplication } = this.props;

    if (this.state.isLoading || !dateEvent || !dateEventApplications) {
      return <Page isLoading />;
    }

    return (
      <Page contentScrolls flexDirection="row" size="100%">
        <Head noScroll disableGoogle />

        <Sidebar
          dateEvent={dateEvent}
          dateEventApplications={dateEventApplications}
        />

        <DateEventApplication
          dateEvent={dateEvent}
          onPick={this.handlePickDate}
          onReschedule={this.handleReschedule}
          dateEventApplication={currentApplication}
        />
      </Page>
    );
  }
}

const DateEventListWithStore = withRedux(
  initStore,
  (state, props) => {
    const dateEventApplications =
      dateEventApplicationsByDateEventID(state)[props.url.query.dateEventId] ||
      [];
    const selectedApplicationId = _.get(props, "url.query.id");
    return {
      dateEventApplications,
      selectedApplicationId,
      currentApplication: dateEventApplications.find(
        ({ id }) => selectedApplicationId === id
      ),
      dateEvent: dateEventSelector(props.url.query.dateEventId)(state)
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(DateEventList, { loginRequired: true }));

export default DateEventListWithStore;
