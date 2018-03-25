import Text from "../Text";
import Tag from "../Tag";
import Divider from "../Divider";
import Icon from "../Icon";
import { COLORS, SPACING } from "../../helpers/styles";

export default ({ dateEvent }) => (
  <div className="Timing">
    <Tag.DateEventTime dateEvent={dateEvent} />

    <Divider width={`${SPACING.HUGE}px`} color="transparent" />

    <div className="LocationGroup">
      <Icon type="location" size="14px" color={COLORS.MEDIUM_GRAY} />
      &nbsp;
      <Text size="14px" color={COLORS.DARK_GRAY}>
        {dateEvent.location}
      </Text>
    </div>

    <style jsx>{`
      .Timing {
        display: flex;
        justify-content: center;
      }

      .LocationGroup {
        display: flex;
        align-items: center;
      }
    `}</style>
  </div>
);
