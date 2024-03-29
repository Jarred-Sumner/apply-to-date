import { Link } from "../routes";
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
  updateQuery,
  buildMobileMatchmakeURL
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
import EmptyPage from "../components/EmptyPage";
import { logEvent } from "../lib/analytics";
import { buildImgSrcSet } from "../lib/imgUri";

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

        <style jsx>{`
          .Actions {
            display: flex;
            padding: 10px 14px;
            width: 100%;
            height: ${ACTIONS_MENU_HEIGHT + "px"};
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

    if (rating === 0) {
      logEvent("Matchmake Skip");
    } else if (rating === 1 || rating === 5) {
      logEvent("Matchmake Vote", {
        rating
      });
    }

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
          size="100%"
        >
          <Head disableGoogle title={`Matchmaker | Apply to Date`} />
          <ViewMatchmakeProfile
            profileRef={profileRef => (this.profileRef = profileRef)}
            isMobile={isMobile}
            profile={profile}
            onSwipe={this.handleChangeTabFromSwipe}
          />
          <div
            style={{
              height: 175,
              display: "block",
              content: "",
              width: 1
            }}
          />

          <Portal>
            <Swipeable onSwiping={this.handleSwipe}>
              <div className="FloatingFooter">
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
                              srcSet={buildImgSrcSet(
                                _.first(leftProfile.photos),
                                18
                              )}
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
                              srcSet={buildImgSrcSet(
                                _.first(rightProfile.photos),
                                18
                              )}
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
                          Should these two go on a date?
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
              </div>
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

            :global(.FloatingFooter) {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
            }
          `}</style>
        </Page>
      );
    } else {
      const leftUrl = buildProfileShareURL(leftProfile.id);
      const rightUrl = buildProfileShareURL(rightProfile.id);
      return (
        <Page size="100%">
          <Head
            mobileURL={buildMobileMatchmakeURL()}
            noScroll
            disableGoogle
            title={`Matchmaker | Apply to Date`}
          />
          <div className="Container">
            <div className="ProfileContainer ProfileContainer--left">
              <div className="ProfileContainer-header">
                <a href={leftUrl} target="_blank">
                  <Text size={"14px"} lineHeight={"14px"} weight="bold">
                    <Text underline weight="regular" size="inherit">
                      @{leftProfile.id}
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
              <div className="ProfileScrollBox">
                <ViewMatchmakeProfile profile={leftProfile} />
              </div>
            </div>
            <div className="Divider" />
            <div className="ProfileContainer ProfileContainer--right">
              <div className="ProfileContainer-header">
                <a href={rightUrl} target="_blank">
                  <Text size={"14px"} lineHeight={"14px"} weight="bold">
                    <Text underline weight="regular" size="inherit">
                      @{rightProfile.id}
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
              <div className="ProfileScrollBox">
                <ViewMatchmakeProfile profile={rightProfile} />
              </div>
            </div>

            <Subheader bottom fade>
              <div className="RateFooter">
                <Text color="black" size="16px" weight="bold">
                  Should these two go on a date?
                </Text>
                <RateButton isMobile setValue={this.handleSetRating} />
              </div>
            </Subheader>
          </div>
          <style jsx>{`
            .Container {
              display: flex;
              justify-content: center;
              width: 100vw;
              height: 100%;
            }

            .RateFooter {
              display: grid;
              justify-content: center;
              grid-row-gap: 20px;
              width: 100%;
              padding-bottom: 20px;
              padding-top: 70px;
            }

            .Divider {
              height: 100%;
              width: 2px;
              margin-top: 2px;
              background-color: #e7e7e7;
              flex: 0 0 2px;
            }

            .ProfileContainer {
              background-color: white;
              display: flex;
              flex: 1;
              flex-direction: column;
            }

            .ProfileScrollBox {
              overflow-y: scroll;
              flex: 1;
              height: 100%;
              padding-bottom: 233px;
            }

            .ProfileScrollBox ::-webkit-scrollbar {
              appearance: none;
              width: 7px;
            }
            .ProfileScrollBox ::-webkit-scrollbar-thumb {
              border-radius: 4px;
              background-color: rgba(0, 0, 0, 0.5);
              box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
            }

            .ProfileContainer-header {
              display: flex;
              background-color: #f8f8f8;
              border-top: 1px solid #e2e2e2;
              justify-content: space-between;
              align-items: center;
              flex: 0 0 auto;
              padding: 14px 42px;
            }

            .ProfileContainer-header a {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: auto;
              width: auto;
            }

            .ShareButtons {
              overflow: hidden;
              justify-content: flex-end;
              display: flex;
              min-height: 36px;
            }

            .Rate {
              display: grid;
              grid-auto-flow: row;
              grid-row-gap: 28px;
              text-align: center;
              padding: 14px 0;
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

const getProfilesFromQuery = async params => {
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
};

class ProfileGate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingProfile: !this.props.leftProfile && !this.props.rightProfile,
      leftProfile: this.props.leftProfile,
      rightProfile: this.props.rightProfile
    };
  }

  static async getInitialProps({ store, query }) {
    if (query.l && query.r) {
      return getProfilesFromQuery(query);
    }
  }

  async componentDidMount() {
    if (!this.props.leftProfile && !this.props.rightProfile) {
      this.loadProfile(this.props, {
        l: this.props.url.query.l,
        r: this.props.url.query.r
      });
    }
  }

  getProfiles = async params => {
    if (params.l && params.r) {
      return getProfilesFromQuery(params);
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
      return (
        <EmptyPage
          title="Come back later :)"
          description="You've done all the matchmaking we need for now, and it's time for us to process the data."
        />
      );
    }
  }
}

const ProfileWithStore = withRedux(initStore, null, null, null, {
  pure: false
})(
  LoginGate(ProfileGate, {
    loginRequired: true,
    head: (
      <Head
        mobileURL={buildMobileMatchmakeURL()}
        noScroll
        disableGoogle
        title={`Matchmaker | Apply to Date`}
      />
    )
  })
);

export default ProfileWithStore;
