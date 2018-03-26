import Button from "../Button";
import Icon from "../Icon";
import LoginGate, { LOGIN_STATUSES } from "../LoginGate";
import {
  buildApplyURL,
  buildApplicantApplicationURL,
  buildDateEventApplyURL
} from "../../lib/routeHelpers";
import { updateApplication, createDateEventApplication } from "../../api";
import { Router } from "../../routes";
import Alert from "../Alert";
import { logEvent } from "../../lib/analytics";
import _ from "lodash";
import { APPLICANT_STATUSES } from "../../helpers/dateEvent";
import { COLORS } from "../../helpers/styles";

class AskDateEventOutButton extends React.Component {
  render() {
    const {
      currentUser,
      profile,
      applicantStatus,
      onEdit,
      onAskOut,
      isAskingOut,
      dateEvent,
      loginStatus,
      componentRef
    } = this.props;

    if ([LOGIN_STATUSES.guest, LOGIN_STATUSES.checking].includes(loginStatus)) {
      return (
        <Button
          componentRef={componentRef}
          href={buildDateEventApplyURL(dateEvent.profileId, dateEvent.slug)}
          maxWidth="150px"
          size="large"
          onClick={onAskOut}
          color="blue"
        >
          Ask to go
        </Button>
      );
    }

    if (applicantStatus === APPLICANT_STATUSES.pending_approval) {
      return (
        <Button
          componentRef={componentRef}
          icon={<Icon type="check" color={COLORS.BLUE} size="14px" />}
          maxWidth="150px"
          size="large"
          color="blue"
          fill={false}
          onClick={onEdit}
        >
          Sent
        </Button>
      );
    } else if (applicantStatus === APPLICANT_STATUSES.declined) {
      return (
        <Button
          icon={<Icon type="x" color={COLORS.BLUE} size="14px" />}
          maxWidth="150px"
          size="large"
          componentRef={componentRef}
          fill={false}
          disabled
          color="blue"
        >
          Declined
        </Button>
      );
    } else {
      const copy = `Ask to go`;

      if (currentUser && currentUser.isAutoApplyEnabled) {
        return (
          <Button
            size="large"
            componentRef={componentRef}
            onClick={onAskOut}
            color="blue"
            maxWidth="150px"
            pending={isAskingOut}
          >
            {copy}
          </Button>
        );
      } else {
        return (
          <Button
            componentRef={componentRef}
            maxWidth="150px"
            size="large"
            onClick={onAskOut}
            color="blue"
          >
            {copy}
          </Button>
        );
      }
    }
  }
}

export default LoginGate(AskDateEventOutButton);
