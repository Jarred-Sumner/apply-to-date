import Text from "./Text";
import { COLORS } from "../helpers/styles";
import moment from "moment";

const Tag = ({ children, color }) => {
  return (
    <div className="Tag">
      <Text
        color="white"
        weight="bold"
        casing="uppercase"
        lineHeight="17px"
        size="12px"
        wrap={false}
      >
        {children}
      </Text>

      <style jsx>{`
        .Tag {
          padding: 4px 21px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${color};
          width: auto;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

const getDateEventFormat = date => {
  const relativeDay = moment().startOf("day");

  if (
    moment(date).isBetween(
      moment(relativeDay),
      moment(relativeDay)
        .add(6, "day")
        .startOf("day")
    )
  ) {
    return moment(date).format("ddd");
  } else if (moment(date).isAfter(relativeDay)) {
    return moment(date).format("MMM DD");
  } else if (moment(date).isSame(relativeDay, "day")) {
    return "Today";
  } else if (
    (moment(date).isBetween(moment(relativeDay).subtract(6, "day")),
    relativeDay)
  ) {
    return "last " + moment(date).format("ddd");
  } else {
    return moment(date).format("MMM DD");
  }
};

Tag.DateEventTime = ({ dateEvent }) => {
  return (
    <Tag
      color={
        moment(dateEvent.occursOnDay).isSame(moment(), "day")
          ? COLORS.BLUE
          : COLORS.MEDIUM_GRAY
      }
      textColor={
        moment(dateEvent.occursOnDay).isSame(moment(), "day")
          ? COLORS.WHITE
          : COLORS.GRAY
      }
    >
      {getDateEventFormat(dateEvent.occursOnDay)}
    </Tag>
  );
};

export default Tag;
