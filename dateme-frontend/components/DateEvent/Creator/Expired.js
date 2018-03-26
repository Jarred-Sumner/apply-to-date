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
import EditableTitle from "../EditableTitle";

export default class PendingDateEvent extends React.Component {
  render() {
    const {
      dateEvent,
      profile,
      applicantStatus,
      onEdit,
      onAskOut,
      onCancel
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

        <Text
          align="center"
          weight="semiBold"
          size="16px"
          color={COLORS.DARK_GRAY}
        >
          This date already happened
        </Text>

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
