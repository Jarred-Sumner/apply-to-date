import Text from "../Text";
import Icon from "../Icon";
import moment from "moment";
import { Link } from "../../routes";
import classNames from "classnames";
import Thumbnail from "../Thumbnail";
import { buildRouteForNotification } from "../../lib/routeHelpers";
import { labelWithPrefix, CATEGORIES } from "../../helpers/dateEvent";

const KINDS = {
  NEW_APPLICATION: "new_application",
  APPROVED_APPLICATION: "approved_application",
  PROFILE_VIEWED: "profile_viewed",
  NEW_DATE_EVENT_APPLICATION: "new_date_event_application",
  PLEASE_RSVP_TO_DATE_EVENT: "please_rsvp_to_date_event",
  SWAPPED_DATE_EVENT: "swapped_date_event"
};

const categoryLabel = category => {
  if (
    [
      CATEGORIES.dine,
      CATEGORIES.lunch,
      CATEGORIES.coffee,
      CATEGORIES.fitness
    ].includes(category)
  ) {
    return labelWithPrefix(category);
  } else {
    return `go to ${labelWithPrefix(category)}`;
  }
};

const NotificationText = ({ notification }) => {
  if (notification.kind === KINDS.NEW_APPLICATION) {
    return (
      <Text type="notification">
        <strong>{notification.meta.name}</strong> asked you out
      </Text>
    );
  } else if (notification.kind === KINDS.APPROVED_APPLICATION) {
    return (
      <Text type="notification">
        <strong>{notification.meta.name}</strong> agreed to go on a date with
        you!
      </Text>
    );
  } else if (notification.kind === KINDS.PROFILE_VIEWED) {
    return (
      <Text type="notification">
        <strong>{notification.meta.name}</strong> viewed your profile
      </Text>
    );
  } else if (notification.kind === KINDS.NEW_DATE_EVENT_APPLICATION) {
    return (
      <Text type="notification">
        <strong>{notification.meta.name}</strong> wants to{" "}
        {categoryLabel(notification.meta.category)} with you
      </Text>
    );
  } else if (notification.kind === KINDS.PLEASE_RSVP_TO_DATE_EVENT) {
    return (
      <Text type="notification">
        <strong>{notification.meta.name}</strong> chose to{" "}
        {categoryLabel(notification.meta.category)} with you. Can you still go?
      </Text>
    );
  } else if (notification.kind === KINDS.SWAPPED_DATE_EVENT) {
    return (
      <Text type="notification">
        <strong>{notification.meta.name}</strong> wants to{" "}
        {categoryLabel(notification.meta.category)} with you
      </Text>
    );
  }
};

class NotificationRow extends React.PureComponent {
  render() {
    const { notification, hasRoute } = this.props;

    return (
      <div
        className={classNames("Notification", {
          "Notification--linked": hasRoute
        })}
      >
        <div className="Side Side--Thumbnail">
          <div className="Thumbnail">
            <Thumbnail size="34px" circle url={notification.meta.thumbnail} />
          </div>
        </div>

        <div className="Side Side--text">
          <div className="Text">
            <NotificationText notification={notification} />
          </div>

          <div className="Timestamp">
            <Text type="muted">
              {notification.occurredAt
                ? moment(notification.occurredAt).fromNow()
                : "Some time ago"}
            </Text>
          </div>
        </div>

        {hasRoute && (
          <div className="Side Side--end">
            <Icon type="caret-right" size="12px" color="#333" />
          </div>
        )}

        <style jsx>{`
          .Notification--linked:hover {
            background-color: #f9f9f9;
          }

          .Notification--linked {
            cursor: pointer;
          }

          .Side--text {
            display: grid;
            width: 100%;
            grid-auto-flow: row;
          }

          .Notification {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 7px 14px;
          }

          .Side--Thumbnail {
            width: 34px;
            height: 34px;
            margin-right: 7px;
          }

          .Side .Thumbnail {
            width: 34px;
            height: 34px;
          }
        `}</style>
      </div>
    );
  }
}

export default class NotificationContainer extends React.Component {
  render() {
    const { notification } = this.props;

    const route = buildRouteForNotification(notification);

    if (route) {
      return (
        <Link route={route}>
          <a>
            <NotificationRow notification={notification} hasRoute />
          </a>
        </Link>
      );
    } else {
      return <NotificationRow notification={notification} hasRoute={false} />;
    }
  }
}
