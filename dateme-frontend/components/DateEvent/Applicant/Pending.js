import Text from "../../Text";
import { formatTitle, APPLICANT_STATUSES } from "../../../helpers/dateEvent";
import Tag from "../../Tag";
import Icon from "../../Icon";
import Divider from "../../Divider";
import Button from "../../Button";
import AskOutButton from "../AskOutButton";
import { COLORS, SPACING } from "../../../helpers/styles";
import { createDateEvent, createDateEventApplication } from "../../../api";
import Timing from "../Timing";

export default class PendingDateEvent extends React.Component {
  render() {
    const {
      dateEvent,
      profile,
      applicantStatus,
      applicationId,
      onEdit,
      isAskingOut,
      onAskOut
    } = this.props;
    return (
      <div className="Container">
        <Text align="center" type="ProfilePageTitle">
          {formatTitle({
            profile,
            category: dateEvent.category
          })}
        </Text>

        {dateEvent.summary && <Text type="paragraph">{dateEvent.summary}</Text>}

        <Timing dateEvent={dateEvent} />

        <div className="ButtonContainer">
          <AskOutButton
            applicantStatus={applicantStatus}
            profile={profile}
            dateEvent={dateEvent}
            onAskOut={onAskOut}
            onEdit={onEdit}
            isAskingOut={isAskingOut}
          />
        </div>

        <style jsx>{`
          .Container {
            display: grid;
            grid-row-gap: ${SPACING.HUGE}px;
            align-items: center;
            justify-content: center;
            align-content: center;
          }

          .ButtonContainer {
            display: flex;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }
}
