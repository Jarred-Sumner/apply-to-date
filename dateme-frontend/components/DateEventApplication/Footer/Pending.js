import Text from "../../Text";
import { formatTitle, APPLICANT_STATUSES } from "../../../helpers/dateEvent";
import Tag from "../../Tag";
import Icon from "../../Icon";
import Divider from "../../Divider";
import Button from "../../Button";
import { COLORS, SPACING } from "../../../helpers/styles";
import Timing from "../../DateEvent/Timing";
import TwoThumbnail from "../../TwoThumbnail";
import { LABELS_BY_CATEGORY } from "../../../helpers/dateEvent";
import ContactButton, {
  getContactMethodType,
  getContactMethodLabel,
  getContactMethodURI,
  getContactMethodValue,
  getContactMethodTypeLabel
} from "../../ContactButton";

export default class PendingApplication extends React.Component {
  render() {
    const {
      dateEventApplication,
      dateEvent,
      profile,
      onPick,
      isPicking,
      onSwapDate,
      isSwapping
    } = this.props;
    return (
      <div className="Container">
        <div className="ButtonContainer">
          <Button color="blue" fill={false} size="large" onClick={onSwapDate}>
            Suggest another date
          </Button>

          <Divider width={`${SPACING.NORMAL}px`} color="transparent" />

          <Button
            size="large"
            color="blue"
            onClick={onPick}
            pending={isPicking}
          >
            Choose for {_.lowerCase(LABELS_BY_CATEGORY[dateEvent.category])}
          </Button>
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
            padding: ${SPACING.HUGE}px;
          }
        `}</style>
      </div>
    );
  }
}
