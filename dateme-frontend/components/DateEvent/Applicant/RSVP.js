import Text from "../../Text";
import { formatTitle, APPLICANT_STATUSES } from "../../../helpers/dateEvent";
import Tag from "../../Tag";
import Icon from "../../Icon";
import Divider from "../../Divider";
import Button from "../../Button";
import AskOutButton from "../AskOutButton";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../helpers/styles";
import { createDateEvent, createDateEventApplication } from "../../../api";
import Timing from "../Timing";
import TwoThumbnail from "../../TwoThumbnail";

export default class RSVPDateEvent extends React.Component {
  render() {
    const {
      dateEvent,
      profile,
      applicantStatus,
      applicationId,
      application,
      onConfirmAttendance,
      onDeclineAttendance,
      isUpdatingAttendance
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

        <TwoThumbnail
          left={_.first(application.photos)}
          right={_.first(profile.photos)}
        />

        <div className="RSVPBox">
          <Text weight="semiBold" align="center" size="16px">
            {profile.name} chose you. Can you still go?
          </Text>
          <div className="ButtonGroup">
            <Button
              onClick={onDeclineAttendance}
              pending={isUpdatingAttendance}
              fill={false}
              color="blue"
            >
              Can't go
            </Button>
            <Button
              onClick={onConfirmAttendance}
              pending={isUpdatingAttendance}
              color="blue"
            >
              Yes, I can go
            </Button>
          </div>
        </div>

        <style jsx>{`
          .Container {
            display: grid;
            grid-row-gap: ${SPACING.HUGE}px;
            align-items: center;
            justify-content: center;
            align-content: center;
          }

          .RSVPBox {
            display: grid;
            grid-row-gap: ${SPACING.LARGE}px;
            justify-content: center;
            align-items: center;
          }

          .ButtonGroup {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: ${SPACING.NORMAL}px;
            justify-content: center;
            align-items: center;
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
