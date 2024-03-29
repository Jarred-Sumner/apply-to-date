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
import Waypoint from "react-waypoint";

export default class PendingDateEvent extends React.Component {
  constructor(props) {
    super(props);

    this.buttonRef = null;
  }

  render() {
    const {
      dateEvent,
      profile,
      applicantStatus,
      applicationId,
      onEdit,
      isAskingOut,
      onAskOut,
      onScrollEnterAskButton,
      onScrollLeaveAskButton
    } = this.props;
    return (
      <div className="Container">
        <Text align="center" type="ProfilePageTitle">
          {formatTitle({
            profile,
            category: dateEvent.category
          })}
        </Text>

        {dateEvent.summary && (
          <Text align="center" type="paragraph">
            {dateEvent.summary}
          </Text>
        )}

        <Timing dateEvent={dateEvent} />
        <Waypoint
          scrollableAncestor="window"
          onEnter={onScrollEnterAskButton}
          onLeave={onScrollLeaveAskButton}
        >
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
        </Waypoint>

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
