import Text from "../../Text";
import { formatTitle, APPLICANT_STATUSES } from "../../../helpers/dateEvent";
import Tag from "../../Tag";
import Icon from "../../Icon";
import Divider from "../../Divider";
import TwoThumbnail from "../../TwoThumbnail";
import Button from "../../Button";
import AskOutButton from "../AskOutButton";
import { COLORS, SPACING } from "../../../helpers/styles";
import { createDateEvent, createDateEventApplication } from "../../../api";
import Timing from "../Timing";
import ContactButton, {
  getContactMethodType,
  getContactMethodLabel,
  getContactMethodURI,
  getContactMethodValue,
  getContactMethodTypeLabel
} from "../../ContactButton";
import { himHerThem } from "../../../lib/pronoun";
import EditableTitle from "../EditableTitle";

export default class ConfirmedDateEvent extends React.Component {
  render() {
    const {
      dateEvent,
      profile,
      applicantStatus,
      applicationId,
      application,
      onEdit,
      onPickSomeone
    } = this.props;
    const contactMethodType = getContactMethodType({
      socialLinks: application.socialLinks,
      phone: application.phone,
      sex: application.sex
    });

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
          right={_.first(application.photos)}
          left={_.first(profile.photos)}
        />

        <div className="CenterBox--column">
          <div className="CenterBox">
            <Icon type="check" color={COLORS.BLUE} size="16px" />
            <Divider width={`${SPACING.SMALL}px`} color="transparent" />
            <Text weight="semiBold" size="16px" color={COLORS.BLUE}>
              Confirmed - you should&nbsp;
              {getContactMethodLabel({
                socialLinks: application.socialLinks,
                phone: application.phone,
                sex: application.sex
              }).toLowerCase()}
            </Text>
          </div>

          <Divider height={`${SPACING.LARGE}px`} color="transparent" />

          <div className="CenterBox">
            <ContactButton
              socialLinks={application.socialLinks}
              phone={application.phone}
            />
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

          .CenterBox {
            display: flex;
            justify-content: center;
            align-items: center;
            align-self: center;
          }

          .CenterBox--column {
            flex-direction: column;
          }
        `}</style>
      </div>
    );
  }
}
