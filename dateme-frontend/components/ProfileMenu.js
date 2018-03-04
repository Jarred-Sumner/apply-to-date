import Text from "./Text";
import { getNotifications, markNotificationAsRead } from "../api";
import LoginGate from "./LoginGate";
import _ from "lodash";
import classNames from "classnames";
import onClickOutside from "react-onclickoutside";
import Icon from "./Icon";
import { updateEntities, setUnreadNotificationCount } from "../redux/store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, Router } from "../routes";
import Button from "./Button";
import { logEvent } from "../lib/analytics";
import NotificationRow from "./ProfileMenu/NotificationRow";
import { withRouter } from "next/router";

class _ProfileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  handleClickOutside = () => this.setState({ isOpen: false });
  handleToggleOpen = () => {
    if (!this.props.isMobile) {
      this.setState({ isOpen: !this.state.isOpen });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      unreadNotificationCount,
      updateEntities,
      notifications,
      setUnreadNotificationCount
    } = this.props;

    if (!prevState.isOpen && this.state.isOpen && unreadNotificationCount > 0) {
      setUnreadNotificationCount(0);
      Promise.map(
        notifications.filter(notification => notification.status === "unread"),
        ({ id }) => markNotificationAsRead(id),
        {
          concurrency: 2
        }
      ).then(notifications => {
        notifications.forEach(({ body }) => updateEntities(body));
      });

      logEvent("Read Notifications");
    }
  }

  render() {
    const {
      profile = {},
      notifications,
      unreadNotificationCount,
      isMobile = false
    } = this.props;

    return (
      <div
        className={classNames("Profile", {
          "Profile--open": this.state.isOpen,
          "Profile--closed": !this.state.isOpen,
          "Profile--mobile": isMobile,
          "Profile--hasUnread": unreadNotificationCount > 0
        })}
      >
        <div onClick={this.handleToggleOpen} className="PhotoContainer">
          <div className="PhotoGroup">
            <img className="Photo" src={_.first(profile.photos)} />
            {unreadNotificationCount > 0 && (
              <div className="UnreadCount">
                <Text
                  color="white"
                  size="14px"
                  lineHeight="14px"
                  weight="medium"
                >
                  {unreadNotificationCount}
                </Text>
              </div>
            )}
          </div>
          {!isMobile && (
            <div className="IconContainer">
              <Icon type="caret" size="12px" color="#3A405B" />
            </div>
          )}
        </div>

        {this.state.isOpen && (
          <div className="NotificationsList">
            <div className="NotificationsListHeader">
              <Text type="label">Notifications</Text>
            </div>
            <div className="NotificationsRows">
              {notifications.map(notification => (
                <NotificationRow
                  notification={notification}
                  key={notification.id}
                />
              ))}
            </div>
            <div className="NotificationSeeMore">
              <Link route="/notifications">
                <Button size="fit" color="black" href="/notifications">
                  See all
                </Button>
              </Link>
            </div>
          </div>
        )}

        <style jsx>{`
          .Photo {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 7px;
            border: 1px solid #f0f0f0;
            background-color: #f0f0f0;
          }

          .NotificationsList {
            position: absolute;
            right: 0;
            top: 54px;
            width: 320px;
            border-radius: 4px;
            background-color: white;
            display: flex;
            flex-direction: column;
            filter: drop-shadow(0 10px 20px rgba(34, 35, 40, 0.4));
          }

          .NotificationSeeMore {
            padding: 7px 14px;
          }

          .NotificationsListHeader {
            padding: 7px 14px;
          }

          .Profile {
            display: flex;
            position: relative;
          }

          .PhotoContainer {
            display: flex;
            align-items: center;
            position: relative;
            cursor: pointer;
          }

          .UnreadCount {
            opacity: 0;
            pointer-events: none;

            width: 21px;
            height: 21px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;

            position: absolute;
            bottom: -4px;
            right: 11px;
            border-radius: 50%;
            background-color: #c72f2f;
          }

          .Profile--mobile .UnreadCount {
            right: 0;
          }

          .Profile--hasUnread .UnreadCount {
            opacity: 1;
          }

          .Profile--open .IconContainer {
            transform: rotate(180deg);
          }
        `}</style>
      </div>
    );
  }
}

const ProfileMenu = onClickOutside(_ProfileMenu);

class ProfileMenuContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notifications: []
    };
  }

  async componentDidMount() {
    if (this.props.router.asPath !== "/notifications") {
      this.loadNotifications();
    }
  }

  loadNotifications = async () => {
    const notificationsResponse = await getNotifications();

    this.props.updateEntities(notificationsResponse.body);

    const unreadNotificationCount = _.get(
      notificationsResponse,
      "body.data",
      []
    ).filter(notification => notification.status === "unread").length;
    this.props.setUnreadNotificationCount(unreadNotificationCount);
  };

  render() {
    return (
      <ProfileMenu
        isMobile={this.props.isMobile}
        profile={_.get(this.props, "currentUser.profile")}
        notifications={this.props.notifications}
        unreadNotificationCount={this.props.unreadNotificationCount}
        isLoading={this.state.isLoading}
        updateEntities={this.props.updateEntities}
        setUnreadNotificationCount={this.props.setUnreadNotificationCount}
      />
    );
  }
}

const ConnectedProfileMenuContainer = connect(
  state => {
    return {
      notifications: _.orderBy(
        _.values(state.notification),
        ["occurredAt"],
        ["desc"]
      ).slice(0, 5),
      unreadNotificationCount: state.unreadNotificationCount
    };
  },
  dispatch =>
    bindActionCreators(
      { updateEntities, setUnreadNotificationCount },
      dispatch
    ),
  null,
  {
    pure: false
  }
)(ProfileMenuContainer);

export default LoginGate(withRouter(ConnectedProfileMenuContainer));
