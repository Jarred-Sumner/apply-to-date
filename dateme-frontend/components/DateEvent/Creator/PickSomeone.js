import Text from "../../Text";
import {
  formatTitle,
  APPLICANT_STATUSES,
  LABELS_BY_CATEGORY
} from "../../../helpers/dateEvent";
import Tag from "../../Tag";
import Icon from "../../Icon";
import Divider from "../../Divider";
import Button from "../../Button";
import ThumbnailGroup from "../../ThumbnailGroup";
import AskOutButton from "../AskOutButton";
import { COLORS, SPACING } from "../../../helpers/styles";
import { createDateEvent, createDateEventApplication } from "../../../api";
import Timing from "../Timing";
import EditableTitle from "../EditableTitle";
import _ from "lodash";
import { buildPickSomeoneURL } from "../../../lib/routeHelpers";

export default class PickSomeoneDateEvent extends React.Component {
  render() {
    const {
      dateEvent,
      profile,
      applications,
      onEdit,
      onAskOut,
      onCancel,
      onPickSomeone
    } = this.props;
    return (
      <div className="Container">
        <div className="Title">
          <EditableTitle
            onEdit={onEdit}
            category={dateEvent.category}
            profile={profile}
          />
        </div>

        {dateEvent.summary && (
          <Text align="center" type="paragraph">
            {dateEvent.summary}
          </Text>
        )}

        <Timing dateEvent={dateEvent} />

        <div className="PeopleGroup">
          <ThumbnailGroup
            photos={applications.map(({ photos }) => _.first(photos))}
            size="62px"
            remoteSize="62px"
            circle
            ids={applications.map(({ id }) => id)}
            type="date_event_application"
            whiteBorder
          />

          <Divider height={`${SPACING.NORMAL}px`} color="transparent" />

          <Text align="center" size="16px" weight="semiBold">
            <Text size="16px" weight="semiBold" color={COLORS.BLUE}>
              {applications.length}
            </Text>{" "}
            {applications.length > 1 ? "people want" : "person wants"} to go to{" "}
            {LABELS_BY_CATEGORY[dateEvent.category].toLowerCase()} with you
          </Text>

          <Divider height={`${SPACING.LARGE}px`} color="transparent" />

          <div className="ButtonContainer">
            <Button
              href={buildPickSomeoneURL(dateEvent.id)}
              color="blue"
              size="large"
              onClick={onPickSomeone}
            >
              Pick someone
            </Button>
          </div>
        </div>

        <style jsx>{`
          .Title {
            display: flex;
            align-items: center;
          }
          .Container {
            display: grid;
            grid-row-gap: ${SPACING.HUGE}px;
            align-items: center;
            justify-content: center;
            align-content: center;
          }

          .PeopleGroup {
            display: flex;
            justify-content: center;
            flex-direction: column;
            background-color: white;
            padding: ${SPACING.LARGE}px ${SPACING.NORMAL}px;
            border: 1px solid ${COLORS.GRAY};
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
