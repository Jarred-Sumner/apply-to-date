import Text from "./Text";
import { getNotifications } from "../api";
import LoginGate from "./LoginGate";
import _ from "lodash";
import classNames from "classnames";
import onClickOutside from "react-onclickoutside";
import Icon from "./Icon";

class _ProfileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  handleClickOutside = () => this.setState({ isOpen: false });
  handleToggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const { profile = {}, notifications } = this.props;

    return (
      <div
        className={classNames("Profile", {
          "Profile--open": this.state.isOpen,
          "Profile--closed": !this.state.isOpen,
          "Profile--hasUnread": true
        })}
      >
        <div onClick={this.handleToggleOpen} className="PhotoContainer">
          <div className="PhotoGroup">
            <img className="Photo" src={_.first(profile.photos)} />
            <div className="UnreadCount">
              <Text color="white" size="14px" lineHeight="14px" weight="medium">
                4
              </Text>
            </div>
          </div>
          <div className="IconContainer">
            <Icon type="caret" size="12px" color="#3A405B" />
          </div>
        </div>

        <style jsx>{`
          .Photo {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 7px;
            border: 1px solid #f0f0f0;
            background-color: #f0f0f0;
          }

          .Profile {
            display: flex;
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
    this.loadNotifications();
  }

  loadNotifications = async () => {
    const notificationsResponse = await getNotifications();

    this.setState({
      notifications: _.get(notificationsResponse, "data", []),
      isLoading: false
    });
  };

  render() {
    return (
      <ProfileMenu
        profile={_.get(this.props, "currentUser.profile")}
        notifications={this.state.notifications}
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default LoginGate(ProfileMenuContainer);
