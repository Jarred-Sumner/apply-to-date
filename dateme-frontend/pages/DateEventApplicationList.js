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
  getDateEvent,
  getApplicationsForDateEvent,
  rateDateEventApplication
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
import Divider from "../components/Divider";
import SocialLinkList from "../components/SocialLinkList";
import MessageBar from "../components/DateEventApplication/MessageBar";
import PhotoGroup from "../components/PhotoGroup";
import Typed from "react-typed";
import withLogin from "../lib/withLogin";
import { Router, Link } from "../routes";
import {
  buildProfileURL,
  buildEditProfileURL,
  buildMobileViewProfileURL,
  buildCreatorDateEventApplicationURL
} from "../lib/routeHelpers";
import { getMobileDetect } from "../lib/Mobile";
import {
  getApplicantStatus,
  REGIONS,
  REGION_LABELS,
  getCreatorStatus,
  getApplicationStatus
} from "../helpers/dateEvent";
import Sidebar from "../components/DateEventApplication/Sidebar";
import DateEventApplication from "../components/DateEventApplication/DateEventApplication";
import { SPACING, COLORS } from "../helpers/styles";
import Alert, { handleApiError } from "../components/Alert";
import DateEventApplicationFooter from "../components/DateEventApplication/Footer";
import Subheader from "../components/Subheader";
import SuggestAnotherDateModal from "../components/DateEventApplication/SuggestAnotherDateModal";

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

const updateSelectedApplication = ({ dateEventApplicationId, dateEventId }) =>
  Router.pushRoute(
    `/dates/${dateEventId}/pick-someone/${dateEventApplicationId}`
  );

class DateEventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isSuggestAnotherDateModalOpen: false
    };
  }

  async componentDidMount() {
    await this.loadDateEvents();

    if (!this.props.selectedApplicationId) {
      if (getInitialDateEventId(this.props).dateEventApplicationId) {
        const { dateEventId, dateEventApplicationId } = getInitialDateEventId(
          this.props
        );

        Router.replaceRoute(
          `/dates/${dateEventId}/pick-someone/${dateEventApplicationId}`
        );
      }
    }

    if (
      this.props.dateEvent &&
      this.props.dateEvent.profileId !== this.props.currentProfile.id
    ) {
      Alert.error("This is someone else's date");
      return Router.replaceRoute(`/dates/${this.props.dateEvent.id}`);
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
        return getApplicationsForDateEvent(dateEventId);
      })
      .then(response => this.props.updateEntities(response.body))
      .catch(error => console.error(error))
      .finally(() => this.setState({ isLoading: false, isRefreshing: false }));
  };

  handlePrevious = () => {
    this.incrementApplication(-1);
  };

  handleNext = () => {
    this.incrementApplication(1);
  };

  incrementApplication = offset => {
    const newIndex = this.currentIndex() + offset;
    if (this.hasApplicationAtIndex(newIndex)) {
      return updateSelectedApplication({
        dateEventId: this.props.dateEvent.id,
        dateEventApplicationId: this.props.dateEventApplications[newIndex].id
      });
    }
  };

  hasApplicationAtIndex = index => {
    return !!this.props.dateEventApplications[index];
  };

  currentIndex = () => {
    return _.findIndex(
      this.props.dateEventApplications,
      app => app.id === this.props.selectedApplicationId
    );
  };

  showNext = () => {
    return this.hasApplicationAtIndex(this.currentIndex() + 1);
  };

  showPrevious = () => {
    return this.hasApplicationAtIndex(this.currentIndex() - 1);
  };

  handleSwapDate = () => {
    this.setState({ isSuggestAnotherDateModalOpen: true });
  };

  hideSwapDate = () => this.setState({ isSuggestAnotherDateModalOpen: false });

  handlePick = () => {
    if (this.state.isPicking) {
      return;
    }

    this.setState({
      isPicking: true
    });

    rateDateEventApplication(
      this.props.dateEvent.id,
      this.props.currentApplication.id,
      "approved"
    )
      .then(response => {
        this.props.updateEntities(response.body);
      })
      .catch(exception => {
        handleApiError(exception);
      })
      .finally(() => this.setState({ isPicking: false }));
  };

  render() {
    const {
      dateEvent,
      dateEventApplications,
      currentApplication,
      currentProfile,
      doubleConfirmedApplication
    } = this.props;

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

        {currentApplication && (
          <div className="Container">
            {this.showPrevious() && (
              <div className="NavButton NavButton--back">
                <Button
                  onClick={this.handlePrevious}
                  icon={
                    <Icon
                      type="caret-right"
                      rotate="180deg"
                      size="14px"
                      color={COLORS.BLUE}
                    />
                  }
                  circle
                  color="blue"
                  fill={false}
                />
              </div>
            )}

            {this.showNext() && (
              <div className="NavButton NavButton--next">
                <Button
                  icon={
                    <Icon type="caret-right" size="14px" color={COLORS.BLUE} />
                  }
                  circle
                  onClick={this.handleNext}
                  color="blue"
                  fill={false}
                />
              </div>
            )}

            <div className="ScrollBox">
              <MessageBar
                dateEventApplications={dateEventApplications}
                dateEvent={dateEvent}
                currentApplication={currentApplication}
              />
              <div className="ApplicationContainer">
                <div className="Application">
                  <DateEventApplication
                    dateEvent={dateEvent}
                    dateEventApplication={currentApplication}
                  />
                  <Divider height={"140px"} color="transparent" />{" "}
                  {/* Footer */}
                </div>
              </div>
            </div>

            <div className="Footer">
              <Subheader padding="none" center fade>
                <DateEventApplicationFooter
                  dateEvent={dateEvent}
                  dateEventApplication={currentApplication}
                  profile={currentProfile}
                  applicationStatus={getApplicationStatus(currentApplication)}
                  onSwapDate={this.handleSwapDate}
                  onPick={this.handlePick}
                  isPicking={this.state.isPicking}
                  isSwapping={this.state.isSwapping}
                />
              </Subheader>
            </div>

            <SuggestAnotherDateModal
              dateEvent={dateEvent}
              dateEventApplication={currentApplication}
              open={this.state.isSuggestAnotherDateModalOpen}
              onHide={this.hideSwapDate}
            />
          </div>
        )}

        <style jsx>{`
          .Application {
            padding-left: ${SPACING.HUGE}px;
            padding-right: ${SPACING.HUGE}px;
            margin-left: auto;
            margin-right: auto;
            max-width: 800px;
            justify-content: center;
            display: flex;
            flex-direction: column;
          }

          .Footer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .Container {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
          }

          .NavButton {
            position: absolute;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            pointer-events: box-none;
            padding-left: ${SPACING.LARGE}px;
            padding-right: ${SPACING.LARGE}px;
          }

          .NavButton--back {
            left: 0;
          }

          .NavButton--next {
            right: 0;
          }

          .ScrollBox {
            overflow: auto;
            flex: 1;
          }

          .Header {
            width: 100%;
            padding: ${SPACING.HUGE}px;
          }

          .Wrapper {
            width: 100%;
            position: relative;
          }

          .DateEventBackground {
            position: absolute;
            z-index: -1;
            background-color: ${COLORS.UNDERLAY_GRAY};
            padding: ${SPACING.HUGE}px;
            width: 100%;
            height: 100%;
            display: block;
            content: "";
          }
        `}</style>
      </Page>
    );
  }
}

const DateEventListWithStore = withRedux(
  initStore,
  (state, props) => {
    const dateEvent = dateEventSelector(props.url.query.dateEventId)(state);
    const dateEventApplications =
      dateEventApplicationsByDateEventID(state)[props.url.query.dateEventId] ||
      [];
    const selectedApplicationId = _.get(props, "url.query.id");
    return {
      dateEventApplications,
      selectedApplicationId,
      dateEvent,
      currentApplication: dateEventApplications.find(
        ({ id }) => selectedApplicationId === id
      )
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(DateEventList, { loginRequired: true }));

export default DateEventListWithStore;
