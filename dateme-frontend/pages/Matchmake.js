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
import { Router } from "../routes";
import { buildProfileURL, buildEditProfileURL } from "../lib/routeHelpers";
import { getMobileDetect } from "../lib/Mobile";
import Subheader from "../components/Subheader";
import { animateScroll } from "react-scroll";
import Linkify from "react-linkify";
import Storage from "../lib/Storage";
import ViewMatchmakeProfile from "../components/ViewMatchmakeProfile";
import Star from "../components/Star";

class RateButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || 0
    };
  }

  componentWillReceiveProps(props) {
    if (props.value !== this.props.value) {
      this.setState({
        value: props.value
      });
    }
  }

  setPendingValue = value => evt => this.setState({ value });
  setValue = value => evt => {
    this.props.setValue(value);
  };

  render() {
    const { value } = this.state;
    const { isMobile } = this.props;

    return (
      <div onMouseLeave={this.setPendingValue(this.props.value)}>
        <Star
          onMouseOver={this.setPendingValue(1)}
          onClick={this.setValue(1)}
          filledIn={value >= 1}
          size={isMobile ? 36 : 40}
        />
        <Star
          onMouseOver={this.setPendingValue(2)}
          onClick={this.setValue(2)}
          filledIn={value >= 2}
          size={isMobile ? 36 : 40}
        />
        <Star
          onMouseOver={this.setPendingValue(3)}
          onClick={this.setValue(3)}
          filledIn={value >= 3}
          size={isMobile ? 36 : 40}
        />
        <Star
          onMouseOver={this.setPendingValue(4)}
          onClick={this.setValue(4)}
          filledIn={value >= 4}
          size={isMobile ? 36 : 40}
        />
        <Star
          onMouseOver={this.setPendingValue(5)}
          onClick={this.setValue(5)}
          filledIn={value >= 5}
          size={isMobile ? 36 : 40}
        />

        <style jsx>{`
          div {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 14px;
            justify-content: center;
            grid-template-columns: repeat(5, 40px);
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
}

class MatchmakeProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHeaderSticky: false,
      selectedTabIndex: 0
    };
  }

  componentWillMount() {
    this.isMobile = getMobileDetect().mobile();
  }

  handleSkip = () => {
    this.props.loadNextPage();
  };

  handleSetRating = async rating => {
    const { leftProfile, rightProfile } = this.props;
    const response = await createMatch({
      left_profile_id: leftProfile.id,
      right_profile_id: rightProfile.id,
      rating
    });

    this.props.loadNextPage();
  };

  setSelectedTab = selectedTabIndex => evt =>
    this.setState({ selectedTabIndex });

  render() {
    const { leftProfile, rightProfile, currentUser } = this.props;

    if (this.isMobile) {
      const { selectedTabIndex } = this.state;
      const profile = [leftProfile, rightProfile][selectedTabIndex];
      return (
        <Page size="100%">
          <Head disableGoogle title={`Matchmaker | Apply to Date`} />
          <ViewMatchmakeProfile isMobile={this.isMobile} profile={profile} />

          <Subheader noBorder bottom>
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
              </div>
            </div>
          </Subheader>
          <style jsx>{`
            .Tabs {
              display: grid;
              grid-auto-flow: column;
              grid-template-columns: 1fr 1fr;
              width: 100%;
              background: #ffffff;
              box-shadow: 0 -2px 14px 0 rgba(0, 0, 0, 0.05);
            }

            .Tab-thumbnail {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              border: 0;
              box-shadow: 0;
              margin-right: 4px;
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

            .Rate-text {
              margin-top: 7px;
              margin-bottom: 14px;
            }

            .RateButton {
              width: 100%;

              display: flex;
              justify-content: center;
            }
          `}</style>
        </Page>
      );
    } else {
      return (
        <Page gray size="100%">
          <Head noScroll disableGoogle title={`Matchmaker | Apply to Date`} />
          <div className="Container">
            <div className="ProfileContainer ProfileContainer--left">
              <ViewMatchmakeProfile profile={leftProfile} />
            </div>
            <div className="ProfileContainer ProfileContainer--right">
              <ViewMatchmakeProfile profile={rightProfile} />
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
              grid-template-rows: minmax(400px, 65vh) auto;
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
              overflow-y: auto;
              background-color: white;
              box-shadow: 0 2px 10px 0 #e8e8e8;
              border-radius: 8px;
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
    this.loadProfile(this.props);
  }

  loadProfile = async props => {
    const { currentUser = {} } = props;

    const excludedProfiles = await Storage.matchmakerProfiles();
    const response = await getNewMatchmake({});

    const normalized = normalizeApiResponse(response.body);

    const leftProfileId = _.get(
      normalized,
      "matchmake.null.relationships.left_profile.data.id"
    );
    const rightProfileId = _.get(
      normalized,
      "matchmake.null.relationships.right_profile.data.id"
    );

    this.setState({
      isLoadingProfile: false,
      leftProfile: normalized.profile
        ? normalized.profile[leftProfileId]
        : null,
      rightProfile: normalized.profile
        ? normalized.profile[rightProfileId]
        : null
    });
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
})(LoginGate(ProfileGate));

export default ProfileWithStore;
