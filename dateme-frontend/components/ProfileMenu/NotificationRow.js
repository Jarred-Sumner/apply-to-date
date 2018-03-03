import Text from "../Text";
import moment from "moment";

const KINDS = {
  NEW_APPLICATION: new_application,
  APPROVED_APPLICATION: approved_application,
  PROFILE_VIEWED: profile_viewed
};

const NotificationText = ({ notification }) => {
  if (notification.kind === KINDS.NEW_APPLICATION) {
    return (
      <Text type="notification">{notification.meta.name} asked you out</Text>
    );
  } else if (notification.kind === KINDS.APPROVED_APPLICATION) {
    return (
      <Text type="notification">
        {notification.meta.name} agreed to go on a date with you!
      </Text>
    );
  } else if (notification.kind === KINDS.PROFILE_VIEWED) {
    return (
      <Text type="notification">
        {notification.meta.name} viewed your profile
      </Text>
    );
  }
};

export default class NotificationRow extends React.Component {
  render() {
    const { notification } = this.props;

    return (
      <div className="Notification">
        <div className="Text">
          <NotificationText notification={notification} />
        </div>

        <div className="Timestamp">
          <Text type="muted">
            {moment(notification.createdAt).fromNow()} ago
          </Text>
        </div>

        <style jsx>{`
          .Notification {
            display: grid;
            width: 100%;
            grid-auto-flow: row;
          }
        `}</style>
      </div>
    );
  }
}
