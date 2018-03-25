import {
  APPLICANT_STATUSES,
  CREATOR_STATUSES,
  isOwnedByCurrentUser
} from "../../helpers/dateEvent";
import PendingDateEvent from "./Applicant/Pending";
import RSVPDateEvent from "./Applicant/RSVP";
import ConfirmedDateEvent from "./Applicant/Confirmed";
import NewEvent from "./Creator/NewEvent";
import PickSomeone from "./Creator/PickSomeone";
import SingleConfirmRSVP from "./Creator/SingleConfirmRSVP";
import DoubleConfirmRSVP from "./Creator/DoubleConfirmRSVP";
import CreatorExpired from "./Creator/Expired";
import CreatorHidden from "./Creator/Hidden";
import ApplicantExpired from "./Applicant/Expired";

export default class DateEvent extends React.Component {
  render() {
    const {
      dateEvent,
      profile,
      applicantStatus,
      creatorStatus,
      applicationId,
      application,
      applications,
      onEdit,
      onEditDate,
      isAskingOut,
      onAskOut,
      onConfirmAttendance,
      onDeclineAttendance,
      currentProfile,
      onCancelEvent,
      isUpdatingAttendance,
      onPickSomeone
    } = this.props;

    if (isOwnedByCurrentUser({ currentProfile, dateEvent })) {
      if (creatorStatus === CREATOR_STATUSES.new_event) {
        return (
          <NewEvent
            onEdit={onEditDate}
            profile={profile}
            dateEvent={dateEvent}
          />
        );
      } else if (creatorStatus === CREATOR_STATUSES.pick_someone) {
        return (
          <PickSomeone
            onEdit={onEditDate}
            profile={profile}
            dateEvent={dateEvent}
            onPickSomeone={onPickSomeone}
            applications={applications}
          />
        );
      } else if (creatorStatus === CREATOR_STATUSES.single_confirm_rsvp) {
        return (
          <SingleConfirmRSVP
            onEdit={onEditDate}
            profile={profile}
            dateEvent={dateEvent}
            onPickSomeone={onPickSomeone}
            application={application}
          />
        );
      } else if (creatorStatus === CREATOR_STATUSES.double_confirm_rsvp) {
        return (
          <DoubleConfirmRSVP
            onEdit={onEditDate}
            profile={profile}
            dateEvent={dateEvent}
            onPickSomeone={onPickSomeone}
            application={application}
          />
        );
      } else if (creatorStatus === CREATOR_STATUSES.expired) {
        return <CreatorExpired profile={profile} dateEvent={dateEvent} />;
      } else if (creatorStatus === CREATOR_STATUSES.hidden) {
        return <CreatorHidden profile={profile} dateEvent={dateEvent} />;
      } else {
        return (
          <NewEvent
            onEdit={onEditDate}
            profile={profile}
            dateEvent={dateEvent}
          />
        );
      }
    } else {
      if (
        [
          APPLICANT_STATUSES.pending,
          APPLICANT_STATUSES.pending_approval,
          APPLICANT_STATUSES.declined
        ].includes(applicantStatus)
      ) {
        return (
          <PendingDateEvent
            dateEvent={dateEvent}
            profile={profile}
            applicantStatus={applicantStatus}
            applicationId={applicationId}
            onEdit={onEdit}
            isAskingOut={isAskingOut}
            onAskOut={onAskOut}
          />
        );
      } else if (APPLICANT_STATUSES.rsvp === applicantStatus) {
        return (
          <RSVPDateEvent
            dateEvent={dateEvent}
            profile={profile}
            applicantStatus={applicantStatus}
            applicationId={applicationId}
            application={application}
            onConfirmAttendance={onConfirmAttendance}
            onDeclineAttendance={onDeclineAttendance}
            isUpdatingAttendance={isUpdatingAttendance}
          />
        );
      } else if (APPLICANT_STATUSES.confirmed === applicantStatus) {
        return (
          <ConfirmedDateEvent
            dateEvent={dateEvent}
            profile={profile}
            applicantStatus={applicantStatus}
            applicationId={applicationId}
            application={application}
          />
        );
      } else {
        return <ApplicantExpired dateEvent={dateEvent} profile={profile} />;
      }
    }
  }
}
