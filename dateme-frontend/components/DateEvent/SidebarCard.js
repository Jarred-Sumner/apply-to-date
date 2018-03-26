import { COLORS, SPACING } from "../../helpers/styles";
import Text from "../Text";
import moment from "moment";
import Tag from "../Tag";
import Divider from "../Divider";
import {
  EMOJI_BY_CATEGORY,
  LABELS_BY_CATEGORY,
  formatTitle
} from "../../helpers/dateEvent";
import Thumbnail from "../Thumbnail";
import classNames from "classnames";
import ActiveLink from "../ActiveLink";

const THUMBNAIL_SIZE = 40;

class PendingDateEventCard extends React.Component {
  render() {
    const {
      dateEvent,
      profile,
      isAskingOut,
      hasDeclined,
      onAskOut,
      onReadMore,
      hasApplied,
      onPressEllipsis,
      isActive,
      href,
      onClick
    } = this.props;
    const { category, occursOnDay, location, summary } = dateEvent;

    return (
      <a
        href={href}
        onClick={onClick}
        className={classNames("Container", {
          "Container--active": isActive
        })}
      >
        {isActive && (
          <div className="DividerContainer">
            <Divider width="3px" height="100%" color={COLORS.BLUE} />
          </div>
        )}

        <div className="Thumbnail">
          <Thumbnail
            url={_.first(profile.photos)}
            size={THUMBNAIL_SIZE}
            type="profile"
            id={profile.id}
            remoteSize={THUMBNAIL_SIZE}
            circle
            hideBorder
          />
        </div>

        <Divider width={`${SPACING.NORMAL}px`} color="transparent" />

        <div className="TextContainer">
          <Text width="137px" wrap={false} weight="medium" size="14px">
            {profile.name}
          </Text>

          <Text width="137px" wrap={false} type="muted" size="14px">
            {EMOJI_BY_CATEGORY[dateEvent.category]}

            {moment(occursOnDay).format("ddd, MMM DD")}
          </Text>
        </div>

        <style jsx>{`
          .Thumbnail {
            width: ${THUMBNAIL_SIZE}px;
            height: ${THUMBNAIL_SIZE}px;
            flex-grow: 0;
            flex-shrink: 0;
            border-radius: ${THUMBNAIL_SIZE / 2}px;
          }

          .DividerContainer {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
          }

          .Container {
            display: flex;
            align-items: center;
            padding: ${SPACING.NORMAL}px;
            cursor: pointer;
            position: relative;
          }

          .Container:hover,
          .Container--active {
            background-color: ${COLORS.UNDERLAY_GRAY};
          }

          .TextContainer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
          }
        `}</style>
      </a>
    );
  }
}

export default ActiveLink(PendingDateEventCard);
