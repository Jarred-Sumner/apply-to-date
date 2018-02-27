import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import {
  updateEntities,
  setCurrentUser,
  initStore,
  normalizeApiResponse
} from "../redux/store";
import {
  getProfile,
  getCurrentUser,
  withCookies,
  getNewMatchmake,
  createMatch
} from "../api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Alert from "../components/Alert";
import Sticky from "react-stickynode";
import { Portal } from "react-portal";
import classNames from "classnames";
import { bindActionCreators } from "redux";
import Header from "../components/Header";
import LoginGate, { LOGIN_STATUSES } from "../components/LoginGate";
import Text from "../components/Text";
import Icon from "../components/Icon";
import InlineApply from "../components/profile/InlineApply";
import _ from "lodash";
import titleCase from "title-case";
import Waypoint from "react-waypoint";
import Button from "../components/Button";
import Thumbnail from "../components/Thumbnail";
import PageFooter from "../components/PageFooter";
import Page from "../components/Page";
import SocialLinkList from "../components/SocialLinkList";
import MessageBar from "../components/MessageBar";
import PhotoGroup from "../components/PhotoGroup";
import Typed from "react-typed";
import withLogin from "../lib/withLogin";
import {
  buildEditProfileURL,
  buildProfileURL,
  buildProfileShareURL,
  updateQuery
} from "../lib/routeHelpers";
import { getMobileDetect } from "../lib/Mobile";
import Subheader from "../components/Subheader";
import { animateScroll } from "react-scroll";
import Linkify from "react-linkify";
import Storage from "../lib/Storage";
import Swipeable from "react-swipeable";
import ViewMatchmakeProfile from "../components/ViewMatchmakeProfile";
import Star from "../components/Star";
import onClickOutside from "react-onclickoutside";
import CopyURLForm from "../components/CopyURLForm";
import SharableSocialLink from "../components/SharableSocialLink";
import RateButton from "../components/RateButton";

const ACTIONS_MENU_HEIGHT = 51;

class _MatchmakeActionsMenu extends React.Component {
  handleClickOutside = () => this.props.hide();

  render() {
    const { profile, animated } = this.props;
    return (
      <div className={classNames("Actions")}>
        <div className="Action">
          <CopyURLForm
            icon={<Icon type="link" size="12px" color="#333" />}
            buttonChildren={_.truncate(`@${profile.id}`, {
              length: 15
            })}
            size="small"
            buttonFill={false}
            hideInputOnMobile
            url={buildProfileShareURL(profile.id)}
          />
        </div>
        <div className="Action">
          <Button fill={false} size="small">
            Skip
          </Button>
        </div>

        <style jsx>{`
          .Actions {
            display: flex;
            padding: 10px 14px;
            width: 100%;
            height: calc(${ACTIONS_MENU_HEIGHT}px);
            justify-content: space-around;
            border-top: 1px solid #e8e8e8;
            background-color: white;
          }
        `}</style>
      </div>
    );
  }
}

const MatchmakeActionsMenu = onClickOutside(_MatchmakeActionsMenu);

class MatchmakeProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: 0,
      actionsYOffset: 0
    };
  }

  handleSetRating = async rating => {
    const { leftProfile, rightProfile } = this.props;
    const response = await createMatch({
      left_profile_id: leftProfile.id,
      right_profile_id: rightProfile.id,
      rating
    });

    this.props.loadNextPage();
  };

  handleSkip = () => {
    this.handleSetRating(0);
  };

  handleSwipe = (e, deltaX, deltaY, isFlick) => {
    const MAX_Y_OFFSET = ACTIONS_MENU_HEIGHT;
    const MIN_Y_OFFSET = 0;

    if (!isFlick) {
      return;
    }

    if (this.state.actionsYOffset === MIN_Y_OFFSET && deltaY > 0) {
      this.setState({
        actionsYOffset: MAX_Y_OFFSET
      });
    } else if (this.state.actionsYOffset === MAX_Y_OFFSET && deltaY < 0) {
      this.setState({
        actionsYOffset: MIN_Y_OFFSET
      });
    }
  };

  handleChangeTabFromSwipe = direction => {
    if (direction === "right" && this.state.selectedTabIndex === 1) {
      this.setState({ selectedTabIndex: 0 });
    } else if (direction === "left" && this.state.selectedTabIndex === 0) {
      this.setState({ selectedTabIndex: 1 });
    }
  };

  setSelectedTab = selectedTabIndex => evt =>
    this.setState({ selectedTabIndex });

  render() {
    const { leftProfile, rightProfile, currentUser, isMobile } = this.props;
    const handleSkip = this.handleSkip;

    if (isMobile) {
      const { selectedTabIndex, isSwiping, actionsYOffset } = this.state;
      const profile = [leftProfile, rightProfile][selectedTabIndex];
      return (
        <Page
          headerProps={{
            isSticky: true
          }}
          contentScrolls
          size="100%"
        >
          <Head noScroll disableGoogle title={`Matchmaker | Apply to Date`} />
          <ViewMatchmakeProfile
            profileRef={profileRef => (this.profileRef = profileRef)}
            isMobile={isMobile}
            profile={profile}
            onSwipe={this.handleChangeTabFromSwipe}
          />

          <Portal>
            <Swipeable onSwiping={this.handleSwipe}>
              <Subheader padding="none" transparent noBorder>
                <div className="Container">
                  <div className="Rate">
                    <div className="Tabs">
                      <div
                        onClick={this.setSelectedTab(0)}
                        className={classNames("Tab", {
                          "Tab--selected": selectedTabIndex === 0
                        })}
                      >
                        {leftProfile.photos.length > 0 && (
                          <img
                            src={_.first(leftProfile.photos)}
                            className="Tab-thumbnail"
                          />
                        )}
                        <Text weight="semiBold" size="14px">
                          {leftProfile.name}
                        </Text>
                      </div>

                      <div
                        onClick={this.setSelectedTab(1)}
                        className={classNames("Tab", {
                          "Tab--selected": selectedTabIndex === 1
                        })}
                      >
                        {rightProfile.photos.length > 0 && (
                          <img
                            src={_.first(rightProfile.photos)}
                            className="Tab-thumbnail"
                          />
                        )}
                        <Text weight="semiBold" size="14px">
                          {rightProfile.name}
                        </Text>
                      </div>
                    </div>
                    <div className="Rate-text">
                      <Text size="14px" weight="semiBold">
                        How compatible are they?
                      </Text>
                    </div>
                    <div className="RateButton">
                      <RateButton isMobile setValue={this.handleSetRating} />

                      <div className="ActionsMenuIndicator">
                        <div className="ActionsMenuIndicator-icon">
                          <Icon type="caret" color="#BABABA" size="14px" />
                        </div>
                        <div className="ActionsMenuIndicator-icon">
                          <Icon type="caret" color="#BABABA" size="14px" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <MatchmakeActionsMenu
                    profile={profile}
                    animated={this.state.isSwipingAnimated}
                    hide={() => this.setState({ actionsYOffset: 0 })}
                    yOffset={this.state.actionsYOffset}
                  />
                </div>
              </Subheader>
            </Swipeable>
          </Portal>

          <style jsx>{`
            .Tabs {
              display: grid;
              grid-auto-flow: column;
              grid-template-columns: 1fr 1fr;
              width: 100%;
              background: #ffffff;
              box-shadow: 0 -2px 14px 0 rgba(0, 0, 0, 0.05);
            }

            .Rate {
              background: #fff;
              position: relative;
            }

            .Tab-thumbnail {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              border: 0;
              box-shadow: 0;
              margin-right: 4px;
              object-fit: cover;
              object-position: center;
            }

            .Tab {
              padding: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-bottom: 2px solid transparent;
            }

            .Tab--selected {
              border-bottom-color: #00e2aa;
            }

            .Rate {
              text-align: center;
              width: 100%;
              display: flex;
              flex-direction: column;
              padding-bottom: 14px;
              justify-content: center;
            }

            .Container {
              width: 100%;
              margin-top: -${ACTIONS_MENU_HEIGHT}px;
              transform: translateY(
                ${ACTIONS_MENU_HEIGHT - this.state.actionsYOffset}px
              );
              transition: transform 0.1s linear;
            }

            .Rate-text {
              margin-top: 7px;
              margin-bottom: 14px;
            }

            .RateButton {
              width: 100%;

              display: flex;
              justify-content: center;
            }

            .ActionsMenuIndicator {
              position: absolute;
              bottom: 14px;
              right: 14px;
            }

            .ActionsMenuIndicator-icon:last-of-type {
              margin-top: -7px;
            }
          `}</style>
        </Page>
      );
    } else {
      const leftUrl = buildProfileShareURL(leftProfile.id);
      const rightUrl = buildProfileShareURL(rightProfile.id);
      return (
        <Page gray size="100%">
          <Head noScroll disableGoogle title={`Matchmaker | Apply to Date`} />
          <div className="Container">
            <div className="ProfileContainer ProfileContainer--left">
              <div className="ProfileScrollBox">
                <ViewMatchmakeProfile profile={leftProfile} />
              </div>
              <div className="ProfileContainer-header">
                <a href={leftUrl} target="_blank">
                  <Text size={"14px"} lineHeight={"14px"} weight="bold">
                    {leftProfile.name}&nbsp;
                    <Text underline weight="regular" size="inherit">
                      (@{leftProfile.id})
                    </Text>
                  </Text>
                </a>

                <div className="ShareButtons">
                  <CopyToClipboard
                    text={leftUrl}
                    onCopy={() => Alert.success("Copied")}
                  >
                    <Button
                      size="small"
                      fill={false}
                      icon={<Icon type="link" size="14px" color="#666" />}
                    >
                      Copy link
                    </Button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
            <div className="ProfileContainer ProfileContainer--right">
              <div className="ProfileScrollBox">
                <ViewMatchmakeProfile profile={rightProfile} />
              </div>
              <div className="ProfileContainer-header">
                <a href={rightUrl} target="_blank">
                  <Text size={"14px"} lineHeight={"14px"} weight="bold">
                    {rightProfile.name}&nbsp;
                    <Text underline weight="regular" size="inherit">
                      (@{rightProfile.id})
                    </Text>
                  </Text>
                </a>

                <div className="ShareButtons">
                  <CopyToClipboard
                    text={rightUrl}
                    onCopy={() => Alert.success("Copied")}
                  >
                    <Button
                      size="small"
                      fill={false}
                      icon={<Icon type="link" size="14px" color="#666" />}
                    >
                      Copy link
                    </Button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>

            <div className="Rate">
              <div className="Rate-text">
                <Text inline weight="semiBold">
                  How compatible are they?
                </Text>
                &nbsp;<span onClick={this.handleSkip}>
                  <Text inline hoverable underline>
                    Skip this pair
                  </Text>
                </span>
              </div>
              <div className="RateButton">
                <RateButton setValue={this.handleSetRating} />
              </div>
            </div>
          </div>
          <style jsx>{`
            .Container {
              display: grid;
              grid-template-rows: minmax(400px, calc(100vh - 340px)) max-content;
              height: calc(100vh - 77px);
              overflow: auto;
              grid-column-gap: 28px;
              grid-row-gap: 28px;
              padding-top: 40px;
              justify-content: center;
              grid-template-columns: minmax(200px, 400px) minmax(200px, 400px);
              grid-template-areas:
                "left-profile right-profile"
                "rate rate";
            }

            .ProfileContainer {
              background-color: white;
              box-shadow: 0 2px 10px 0 #e8e8e8;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
            }

            .ProfileScrollBox {
              overflow-y: auto;
              flex: 1;
              height: auto;
            }

            .ProfileContainer-header {
              display: grid;
              background-color: #f8f8f8;
              border-top: 1px solid #e2e2e2;
              grid-template-columns: max-content 1fr;
              grid-auto-flow: column;
              grid-column-gap: 28px;
              align-items: center;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              padding: 14px;
            }

            .ShareButtons {
              overflow: hidden;
              justify-content: flex-end;
              display: flex;
              min-height: 36px;
            }

            .ProfileContainer--left {
              grid-area: left-profile;
            }

            .ProfileContainer--right {
              grid-area: right-profile;
            }

            .Rate {
              display: grid;
              grid-auto-flow: row;
              grid-row-gap: 28px;
              text-align: center;
              padding: 14px 0;

              grid-area: rate;
            }

            .RateButton {
              width: 250px;
              margin-left: auto;
              margin-right: auto;
            }
          `}</style>
        </Page>
      );
    }
  }
}

class ProfileGate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingProfile: true,
      leftProfile: null,
      rightProfile: null
    };
  }

  async componentDidMount() {
    this.loadProfile(this.props, {
      l: this.props.url.query.l,
      r: this.props.url.query.r
    });
  }

  getProfiles = async params => {
    if (params.l && params.r) {
      const exclude = await Storage.matchmakerProfiles();
      const leftProfileResponse = await getProfile(params.l);
      const rightProfileResponse = await getProfile(params.r);

      const normalizedLeft = normalizeApiResponse(leftProfileResponse.body);
      const normalizedRight = normalizeApiResponse(rightProfileResponse.body);

      const leftProfile = _.first(_.values(normalizedLeft.profile));
      const rightProfile = _.first(_.values(normalizedRight.profile));

      return {
        leftProfile,
        rightProfile
      };
    } else {
      const exclude = await Storage.matchmakerProfiles();
      const response = await getNewMatchmake({
        exclude: Array.from(exclude)
      });

      const normalized = normalizeApiResponse(response.body);

      const leftProfileId = _.get(
        normalized,
        "matchmake.null.relationships.left_profile.data.id"
      );
      const rightProfileId = _.get(
        normalized,
        "matchmake.null.relationships.right_profile.data.id"
      );

      return {
        leftProfile: normalized.profile
          ? normalized.profile[leftProfileId]
          : null,
        rightProfile: normalized.profile
          ? normalized.profile[rightProfileId]
          : null
      };
    }
  };

  loadProfile = async (props, params = {}) => {
    const { currentUser = {} } = props;

    const { leftProfile, rightProfile } = await this.getProfiles(params);

    this.setState({
      isLoadingProfile: false,
      leftProfile,
      rightProfile
    });

    const leftProfileId = _.get(leftProfile, "id");
    const rightProfileId = _.get(rightProfile, "id");

    if (leftProfileId && rightProfileId) {
      updateQuery(this.props.url, {
        l: leftProfileId,
        r: rightProfileId
      });
    }
  };

  handleLoadNextPage = async () => {
    const { rightProfile, leftProfile } = this.state;

    this.setState({
      isLoadingProfile: true,
      leftProfile: null,
      rightProfile: null
    });
    this.loadProfile(this.props);
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.loginStatus === LOGIN_STATUSES.checking &&
      nextProps.loginStatus === LOGIN_STATUSES.loggedIn &&
      !this.state.isLoadingProfile
    ) {
      this.loadProfile(this.props);
    }
  }

  render() {
    if (this.state.isLoadingProfile) {
      return <Page isLoading />;
    } else if (this.state.leftProfile && this.state.rightProfile) {
      return (
        <MatchmakeProfile
          {...this.props}
          leftProfile={this.state.leftProfile}
          rightProfile={this.state.rightProfile}
          loadNextPage={this.handleLoadNextPage}
        />
      );
    } else {
      return <Page>TODO empty</Page>;
    }
  }
}

const ProfileWithStore = withRedux(initStore, null, null, null, {
  pure: false
})(
  LoginGate(ProfileGate, {
    loginRequired: true
  })
);

export default ProfileWithStore;
