import {
  dateEventSelector,
  profileSelector,
  dateEventApplicationsByDateEventID,
  updateEntities,
  currentUserDateEventApplicationsByDateEventId,
  currentProfileSelector,
  approvedDateEventApplicationsByDateEventID
} from "../../redux/store";
import {
  getDateEvent,
  createDateEventApplication,
  updateRSVPForDateEventApplication,
  getApplicationsForDateEvent
} from "../../api";
import Alert, { handleApiError } from "../Alert";
import Profile from "./Profile";
import { connect } from "react-redux";
import Spinner from "../Spinner";
import Divider from "../Divider";
import { bindActionCreators } from "redux";
import DateEvent from "./DateEvent";
import {
  getApplicantStatus,
  getCreatorStatus,
  CREATOR_STATUSES,
  APPLICANT_STATUSES,
  isOwnedByCurrentUser
} from "../../helpers/dateEvent";
import { SPACING, COLORS } from "../../helpers/styles";
import { logEvent } from "../../lib/analytics";
import UpdateDateApplication from "./UpdateDateApplication";
import { Collapse } from "react-collapse";
import ShareBar from "./ShareBar";
import EditDateModal from "./EditModal";
import AskOutButton from "./AskOutButton";
import Subheader from "../Subheader";
import { PAGE_SIZES } from "../Page";

class ViewDateEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: !props.dateEvent,
      isAskingOut: false,
      showEditArea: false,
      isUpdatingAttendance: false,
      showEditDateModal: false
    };
  }

  componentDidMount() {
    if (!this.props.dateEvent) {
      this.loadDateEvent();
    }
  }

  fetchDateEvent = () => {
    return getDateEvent(this.props.dateEventId).then(response =>
      this.props.updateEntities(response.body)
    );
  };

  loadDateEvent = () => {
    this.fetchDateEvent()
      .then(() => {
        this.setState({
          isLoading: false
        });
      })
      .catch(exception => {
        handleApiError(exception);
        this.setState({
          isLoading: false
        });
      });
  };

  handleConfirmAttendance = () => {
    this.updateAttendance("confirmed");
  };
  handleDeclineAttendance = () => {
    this.updateAttendance("declined");
  };

  updateAttendance = confirmationStatus => {
    if (this.state.isUpdatingAttendance) {
      return;
    }

    this.setState({ isUpdatingAttendance: true });

    return updateRSVPForDateEventApplication({
      id: this.props.application.id,
      confirmationStatus
    })
      .then(async response => {
        if (confirmationStatus === "confirmed") {
          logEvent("RSVP Date Event", {
            profile: this.props.profile.id,
            providers: _.keys(this.props.currentProfile.socialLinks),
            createAccount: false,
            type: "date_event",
            auto: true
          });
        } else {
          logEvent("Decline Date Event", {
            profile: this.props.profile.id,
            providers: _.keys(this.props.currentProfile.socialLinks),
            createAccount: false,
            type: "date_event",
            auto: true
          });
        }

        this.props.updateEntities(response.body);
      })
      .then(() => this.fetchDateEvent())
      .catch(error => {
        console.error(error);
        handleApiError(error);
        return null;
      })
      .finally(response => {
        this.setState({ isUpdatingAttendance: false });
        return response;
      });
  };

  handleAskOut = () => {
    if (this.state.isAskingOut) {
      return;
    }

    this.setState({ isAskingOut: true });

    return createDateEventApplication({
      profileId: this.props.profile.id,
      dateEventId: this.props.dateEvent.id
    })
      .then(async response => {
        logEvent("Submit Application", {
          profile: this.props.profile.id,
          providers: _.keys(this.props.currentProfile.socialLinks),
          createAccount: false,
          type: "date_event",
          auto: true
        });

        this.props.updateEntities(response.body);

        this.setState({
          showEditArea: true
        });
      })
      .catch(error => {
        console.error(error);
        handleApiError(error);
        return null;
      })
      .finally(response => {
        this.setState({ isAskingOut: false });
        return response;
      });
  };

  get creatorStatus() {
    const {
      profile,
      dateEvent,
      application,
      applications,
      currentProfile
    } = this.props;

    return getCreatorStatus({
      dateEvent,
      dateEventApplication: application,
      dateEventApplications: applications,
      profile,
      currentProfile
    });
  }

  get applicantStatus() {
    const {
      profile,
      dateEvent,
      application,
      applications,
      currentProfile
    } = this.props;

    return getApplicantStatus({
      dateEvent,
      dateEventApplication: application,
      dateEventApplications: applications,
      profile,
      currentProfile: currentProfile
    });
  }

  get shouldShowShareBar() {
    if (this.creatorStatus) {
      return [
        CREATOR_STATUSES.pick_someone,
        CREATOR_STATUSES.new_event,
        CREATOR_STATUSES.single_confirm_rsvp
      ].includes(this.creatorStatus);
    } else {
      return [
        APPLICANT_STATUSES.pending,
        APPLICANT_STATUSES.pending_approval
      ].includes(this.applicantStatus);
    }
  }

  handlHideEditDateModal = () => this.setState({ showEditDateModal: false });
  handleShowEditDateModal = () => {
    this.setState({ showEditDateModal: true });
  };
  handleShowEdit = () => this.setState({ showEditArea: true });
  showFooter = () => {
    console.log("SHOW");
    if (this.props.footerEnabled) {
      this.setState({ showFooter: true });
    }
  };

  hideFooter = () => {
    if (this.props.footerEnabled) {
      console.log("HIDE");
      this.setState({ showFooter: false });
    }
  };

  get shouldShowFooter() {
    return (
      this.state.showFooter &&
      this.props.footerEnabled &&
      [
        APPLICANT_STATUSES.pending,
        APPLICANT_STATUSES.pending_approval,
        APPLICANT_STATUSES.declined
      ].includes(this.applicantStatus)
    );
  }

  render() {
    const {
      profile,
      dateEvent,
      application,
      applications,
      currentProfile
    } = this.props;
    const { isLoading, isAskingOut } = this.state;

    if (isLoading) {
      return <Spinner />;
    } else {
      return (
        <React.Fragment>
          <div id="ProfileScrollBox" className="ProfileContainer">
            <div className="DateEventWrapper">
              <div className="DateEventBackground" />

              {this.shouldShowShareBar && (
                <ShareBar
                  isOwnedByCurrentUser={isOwnedByCurrentUser({
                    dateEvent,
                    currentProfile
                  })}
                  dateEvent={dateEvent}
                />
              )}

              <div className="DateEventContainer">
                <DateEvent
                  dateEvent={dateEvent}
                  profile={profile}
                  onAskOut={this.handleAskOut}
                  isAskingOut={isAskingOut}
                  onEdit={this.handleShowEdit}
                  onEditDate={this.handleShowEditDateModal}
                  applicationId={application && application.id}
                  application={application}
                  applications={applications}
                  currentProfile={currentProfile}
                  onConfirmAttendance={this.handleConfirmAttendance}
                  onDeclineAttendance={this.handleDeclineAttendance}
                  isUpdatingAttendance={this.state.isUpdatingAttendance}
                  creatorStatus={this.creatorStatus}
                  applicantStatus={this.applicantStatus}
                  onScrollEnterAskButton={this.hideFooter}
                  onScrollLeaveAskButton={this.showFooter}
                />

                {application && (
                  <Collapse isOpened={this.state.showEditArea}>
                    <div className="EditArea">
                      <Divider
                        height={`${SPACING.HUGE}px`}
                        color="transparent"
                      />
                      <UpdateDateApplication applicationId={application.id} />
                    </div>
                  </Collapse>
                )}
              </div>
            </div>

            <div className="Profile">
              <Profile isMobile={this.props.isMobile} profile={profile} />
            </div>

            {isOwnedByCurrentUser({ dateEvent, currentProfile }) && (
              <EditDateModal
                open={this.state.showEditDateModal}
                dateEvent={dateEvent}
                onHide={this.handlHideEditDateModal}
              />
            )}

            {this.shouldShowFooter && (
              <Divider height="140px" color="transparent" />
            )}

            {this.shouldShowFooter && (
              <Subheader center bottom fade>
                <div className="AskOutContainer">
                  <AskOutButton
                    dateEvent={dateEvent}
                    onAskOut={this.handleAskOut}
                    isAskingOut={this.state.isAskingOut}
                    applicantStatus={this.applicantStatus}
                  />
                </div>
              </Subheader>
            )}
          </div>

          <style jsx>{`
            .ProfileContainer {
              flex: 1;
              overflow: auto;
            }

            .AskOutContainer {
              padding: ${SPACING.LARGE}px;
            }

            .EditArea {
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-content: center;
              flex-shrink: 0;
              align-self: center;
            }

            /* This exists as a hack to work around the sidebar shadow flickering */
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

            .DateEventContainer {
              width: 100%;
              padding: ${SPACING.HUGE}px;
              margin-left: auto;
              margin-right: auto;
              max-width: ${PAGE_SIZES.default};
            }

            .DateEventWrapper {
              position: relative;
            }

            .Profile {
              padding-left: ${SPACING.HUGE}px;
              padding-right: ${SPACING.HUGE}px;
              margin-left: auto;
              margin-right: auto;
              max-width: 800px;
              justify-content: center;
              display: flex;
              flex-direction: column;
            }

            @media (max-width: 700px) {
              .Profile {
                padding-left: ${SPACING.NORMAL}px;
                padding-right: ${SPACING.NORMAL}px;
              }
            }
          `}</style>
        </React.Fragment>
      );
    }
  }
}

export default connect(
  (state, props) => {
    const dateEvent = dateEventSelector(props.dateEventId)(state);

    const currentUserApplication = currentUserDateEventApplicationsByDateEventId(
      state
    )[_.get(dateEvent, "id")];
    const approvedApplication = approvedDateEventApplicationsByDateEventID(
      state
    )[_.get(dateEvent, "id")];
    const currentProfile = currentProfileSelector(state);

    return {
      dateEvent,
      currentProfile,
      applications: (dateEventApplicationsByDateEventID(state) || {})[
        _.get(dateEvent, "id")
      ],
      application: isOwnedByCurrentUser({ dateEvent, currentProfile })
        ? approvedApplication
        : currentUserApplication,
      profile: profileSelector(state)[_.get(dateEvent, "profileId")]
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(ViewDateEvent);
