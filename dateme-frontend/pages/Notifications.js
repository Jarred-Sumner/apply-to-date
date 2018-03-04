import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import Text from "../components/Text";
import _ from "lodash";
import {
  updateEntities,
  setUnreadNotificationCount,
  setCurrentUser,
  initStore
} from "../redux/store";
import {
  getNotifications,
  markAllNotificationsAsRead,
  getCurrentUser
} from "../api";
import { bindActionCreators } from "redux";
import Router from "next/router";
import classNames from "classnames";
import Icon from "../components/Icon";
import Page from "../components/Page";
import { BASE_AUTHORIZE_URL } from "../components/SocialLogin";
import LoginGate from "../components/LoginGate";
import NotificationRow from "../components/ProfileMenu/NotificationRow";

class Notifications extends React.Component {
  render() {
    return (
      <div>
        <Head title="Notifications | Apply to Date" />
        <Page size="small">
          <main>
            <Text type="PageTitle">Notifications</Text>

            <div className="NotificationsList">
              {this.props.notifications.map(notification => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          </main>
        </Page>
        <style jsx>{`
          main {
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
          }

          .NotificationsList {
            display: grid;
            grid-auto-flow: row;
            text-align: left;
            margin-top: 28px;
          }

          .NotificationsList :global(.Notification) {
            border-bottom: 1px solid #f0f0f0;
          }

          footer {
            display: flex;
            flex-direction: column;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}

class NotificationsGate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingNotifications: true
    };
  }

  async componentDidMount() {
    const notificationsResponse = await getNotifications();
    await markAllNotificationsAsRead();

    this.props.updateEntities(notificationsResponse.body);
    this.props.setUnreadNotificationCount(0);

    this.setState({ isLoadingNotifications: false });
  }

  render() {
    if (this.state.isLoadingNotifications) {
      return <Page isLoading />;
    } else {
      return (
        <Notifications
          updateEntities={this.updateEntities}
          notifications={this.props.notifications}
        />
      );
    }
  }
}

const NotificationsWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      notifications: _.orderBy(
        _.values(state.notification),
        ["occurredAt"],
        ["desc"]
      )
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
)(LoginGate(NotificationsGate, { loginRequired: true }));

export default NotificationsWithStore;
