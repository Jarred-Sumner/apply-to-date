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
import { buildPickSomeoneURL } from "../../../lib/routeHelpers";

export default class SingleConfirmDateEvent extends React.Component {
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
        <EditableTitle
          onEdit={onEdit}
          category={dateEvent.category}
          profile={profile}
        />

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
            <Text weight="semiBold" s ize="16px" color={COLORS.DARK_GRAY}>
              We'll double check with {himHerThem(application.sex)} - you
              should&nbsp;
              {getContactMethodTypeLabel({
                socialLinks: application.socialLinks,
                phone: application.phone,
                sex: application.sex
              }).toLocaleLowerCase()}
              &nbsp;
              {himHerThem(application.sex)}
            </Text>
          </div>

          <Divider height={`${SPACING.LARGE}px`} color="transparent" />

          <div className="CenterBox">
            <Button
              href={buildPickSomeoneURL(dateEvent.id)}
              color="blue"
              fill={false}
              onClick={onPickSomeone}
            >
              Pick someone else
            </Button>

            <Divider width={`${SPACING.NORMAL}px`} color="transparent" />

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
