import MessageBar from "../MessageBar";
import Text from "../Text";
import { defaultProps } from "recompose";
import { Link } from "../../routes";
import { buildCreatorDateEventApplicationURL } from "../../lib/routeHelpers";
import {
  getApplicationStatus,
  APPLICATION_STATUSES,
  labelWithPrefix
} from "../../helpers/dateEvent";
import { COLORS } from "../../helpers/styles";
import { himHerThem } from "../../lib/pronoun";

const MessageBarText = defaultProps({
  color: COLORS.WHITE,
  size: "16px",
  wrap: false,
  weight: "medium"
})(Text);

const getDoubleConfirmedApplication = applications => {
  return applications.find(
    ({ approvalStatus, confirmationStatus }) =>
      approvalStatus === "approved" && confirmationStatus === "confirmed"
  );
};

const getSingleConfirmedApplication = applications => {
  return applications.find(
    ({ approvalStatus, confirmationStatus }) =>
      approvalStatus === "approved" &&
      confirmationStatus === "pending_confirmation"
  );
};

export default ({ currentApplication, dateEventApplications, dateEvent }) => {
  const doubleConfirmedApplication = getDoubleConfirmedApplication(
    dateEventApplications
  );

  const singleConfirmedApplication = getSingleConfirmedApplication(
    dateEventApplications
  );

  if (doubleConfirmedApplication) {
    return (
      <MessageBar color={COLORS.BLUE}>
        <MessageBarText>
          You're all set to go with{" "}
          <Link
            route={buildCreatorDateEventApplicationURL(
              doubleConfirmedApplication.id,
              dateEvent.id
            )}
          >
            <a>{doubleConfirmedApplication.name}</a>
          </Link>
        </MessageBarText>
      </MessageBar>
    );
  } else if (singleConfirmedApplication) {
    return (
      <MessageBar color={COLORS.BLUE}>
        <MessageBarText>
          You chose{" "}
          <Link
            route={buildCreatorDateEventApplicationURL(
              singleConfirmedApplication.id,
              dateEvent.id
            )}
          >
            <a>{singleConfirmedApplication.name}</a>
          </Link>{" "}
          for{" "}
          <Link route={dateEvent.url}>
            <a>{labelWithPrefix(dateEvent.category)}</a>
          </Link>
          . We'll double check with {himHerThem(singleConfirmedApplication.sex)}.
        </MessageBarText>
      </MessageBar>
    );
  } else {
    const status = getApplicationStatus(currentApplication);

    if (status === APPLICATION_STATUSES.swap_date) {
      return (
        <MessageBar color={COLORS.BLUE}>
          <MessageBarText>
            You suggested another date for {currentApplication.name}
          </MessageBarText>
        </MessageBar>
      );
    } else if (status === APPLICATION_STATUSES.declined) {
      return (
        <MessageBar color={COLORS.BLUE}>
          <MessageBarText>
            {currentApplication.name} can't make it
          </MessageBarText>
        </MessageBar>
      );
    } else {
      return null;
    }
  }
};
