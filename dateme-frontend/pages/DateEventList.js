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
import Sidebar from "../components/DateEvent/Sidebar";
import Profile from "../components/DateEvent/Profile";
import CreateDateEventModal from "../components/DateEvent/CreateModal";
import { SPACING } from "../helpers/styles";
import ViewDateEvent from "../components/DateEvent/ViewDateEvent";

const SECTIONS = {
  date_events: "DATE_EVENTS",
  your_upcoming_dates: "YOUR_UPCOMING_DATES",
  upcoming_dates: "UPCOMING_DATES"
};

const buildSections = _.memoize(props => {
  const {
    dateEvents,
    upcomingDateEvents,
    dateEventsPendingRSVP,
    upcomingDateEventApplications,
    currentProfile,
    dateEventApplications,
    dateEventApplicationsByDateEvent,
    approvedDateEventApplicationsByDateEventID
  } = props;

  const filteredUpcomingDateEventApplications = upcomingDateEventApplications
    .filter(application =>
      getApplicantStatus({
        dateEventApplication: application,
        dateEvent: application.dateEvent,
        profile: application.dateEvent.profile,
        currentProfile
      })
    )
    .map(application => ({
      dateEventApplication: application,
      dateEvent: application.dateEvent,
      profile: application.dateEvent.profile,
      currentProfile
    }));

  const filteredUpcomingDateEvents = upcomingDateEvents
    .filter(dateEvent => {
      return getCreatorStatus({
        dateEventApplications: dateEventApplicationsByDateEvent[dateEvent.id],
        dateEventApplication:
          approvedDateEventApplicationsByDateEventID[dateEvent.id],
        dateEvent,
        profile: dateEvent.profile,
        currentProfile
      });
    })
    .map(dateEvent => ({
      dateEventApplications: dateEventApplicationsByDateEvent[dateEvent.id],
      dateEventApplication:
        approvedDateEventApplicationsByDateEventID[dateEvent.id],
      dateEvent,
      profile: dateEvent.profile,
      currentProfile
    }));

  const filteredDateEvents = dateEvents
    .filter(dateEvent =>
      getApplicantStatus({
        dateEventApplication:
          currentUserDateEventApplicationsByDateEventId[dateEvent.id],
        dateEvent,
        profile: dateEvent.profile,
        currentProfile
      })
    )
    .map(dateEvent => ({
      dateEventApplication:
        currentUserDateEventApplicationsByDateEventId[dateEvent.id],
      dateEvent,
      profile: dateEvent.profile,
      currentProfile
    }));

  return {
    dateEvents: filteredDateEvents,
    upcomingDateEvents: filteredUpcomingDateEvents,
    upcomingDateEventApplications: filteredUpcomingDateEventApplications
  };
});

const getInitialDateEventId = props => {
  const {
    dateEvents,
    upcomingDateEvents,
    upcomingDateEventApplications
  } = buildSections(props);

  if (dateEvents.length > 0) {
    return _.first(dateEvents).dateEvent.id;
  } else if (upcomingDateEvents.length > 0) {
    return _.first(upcomingDateEvents).dateEvent.id;
  } else if (upcomingDateEventApplications.length > 0) {
    return _.first(upcomingDateEventApplications).dateEvent.id;
  } else {
    return null;
  }
};

class DateEventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isRefreshing: false,
      footerHeight: 0,
      ...buildSections(props)
    };
  }

  componentDidMount() {
    this.loadDateEvents();

    if (!this.props.selectedDateEventId) {
      const initialDateEventId = getInitialDateEventId(this.props);
      if (initialDateEventId) {
        Router.replaceRoute(`/dates/${initialDateEventId}`);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.region !== prevProps.region) {
      this.loadDateEvents();
    }
  }

  loadDateEvents = () => {
    this.setState({
      isLoading: true
    });

    return getDateEvents({ region: this.props.region })
      .then(response => {
        this.props.updateEntities(response.body);

        return response.body.data.map(({ id }) => id);
      })
      .then(dateEventIds => {
        return getAppliedDateEvents(dateEventIds);
      })
      .then(response => this.props.updateEntities(response.body))
      .then(() => getPendingDateEvents())
      .then(response => this.props.updateEntities(response.body))
      .catch(error => console.error(error))
      .finally(() => this.setState({ isLoading: false, isRefreshing: false }));
  };

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(buildSections(nextProps), buildSections(this.props))) {
      this.setState(buildSections(nextProps));

      if (!nextProps.selectedDateEventId) {
        const initialDateEventId = getInitialDateEventId(nextProps);

        if (initialDateEventId) {
          Router.replaceRoute(`/dates/${initialDateEventId}`);
        }
      }
    }
  }

  componentDidUpdate(prevProps) {}

  render() {
    const {
      dateEvents,
      upcomingDateEvents,
      upcomingDateEventApplications,
      showCreateModal
    } = this.state;

    if (this.state.isLoading) {
      return <Page isLoading />;
    } else if (!this.props.canCurrentUserCreateDateEvents) {
      return (
        <Page contentScrolls flexDirection="row" size="100%">
          <Head noScroll disableGoogle />

          <Text type="title">
            Sorry, this feature is only available in the Bay Area right now.
          </Text>
        </Page>
      );
    }

    return (
      <Page contentScrolls flexDirection="row" size="100%">
        <Head noScroll disableGoogle />

        <Sidebar
          dateEvents={dateEvents}
          region={this.props.region}
          upcomingDateEvents={upcomingDateEvents}
          upcomingDateEventApplications={upcomingDateEventApplications}
        />

        {this.props.selectedDateEventId && (
          <ViewDateEvent
            key={this.props.selectedDateEventId}
            dateEventId={this.props.selectedDateEventId}
          />
        )}
      </Page>
    );
  }
}

const DateEventListWithStore = withRedux(
  initStore,
  (state, props) => {
    const region = currentRegionSelector(state);
    return {
      region,
      canCurrentUserCreateDateEvents: canCurrentUserCreateDateEventsSelector(
        state
      ),
      selectedDateEventId: _.get(props, "url.query.id"),
      dateEvents: dateEventsByRegionSelector(region)(state),
      upcomingDateEventApplications: upcomingDateEventApplicationsSelector(
        state
      ),
      dateEventApplicationsByDateEvent: dateEventApplicationsByDateEventID(
        state
      ),
      approvedDateEventApplicationsByDateEventID: approvedDateEventApplicationsByDateEventID(
        state
      ),
      upcomingDateEvents: upcomingDateEventsSelector(state),
      dateEventApplications: currentUserDateEventApplicationsByDateEventId(
        state
      )
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(DateEventList, { loginRequired: true }));

export default DateEventListWithStore;
