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
          <ContactButton
            size="large"
            socialLinks={dateEventApplication.socialLinks}
            phone={dateEventApplication.phone}
          />
        </div>

        <style jsx>{`
          .Container {
            display: grid;
            grid-row-gap: ${SPACING.HUGE}px;
            align-items: center;
            padding: ${SPACING.HUGE}px;
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
