import { Link } from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import {
  getProfile,
  getCurrentUser,
  withCookies,
  shuffleProfile
} from "../api";
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
import MatchmakePreviewGraphic, {
  getPrefetchURLs
} from "../components/MatchmakePreviewGraphic";
import Thumbnail from "../components/Thumbnail";
import PageFooter from "../components/PageFooter";
import Page from "../components/Page";
import SocialLinkList from "../components/SocialLinkList";
import MessageBar from "../components/MessageBar";
import PhotoGroup from "../components/PhotoGroup";
import Typed from "react-typed";
import withLogin from "../lib/withLogin";
import { Router } from "../routes";
import {
  buildProfileURL,
  buildEditProfileURL,
  buildProfileShareURL,
  buildMobileShuffleURL
} from "../lib/routeHelpers";
import { getMobileDetect } from "../lib/Mobile";
import Subheader from "../components/Subheader";
import { animateScroll } from "react-scroll";
import Linkify from "react-linkify";
import ProfileComponent from "../components/Profile";
import CopyURLForm from "../components/CopyURLForm";
import Storage from "../lib/Storage";
import SharableSocialLink from "../components/SharableSocialLink";
import EmptyPage from "../components/EmptyPage";
import { logEvent } from "../lib/analytics";

const SHUFFLE_PAGE_STATUS = {
  loading: "loading",
  loaded: "loaded",
  cooldown: "cooldown"
};

class ShuffleProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPhotoIndex: null
    };
  }

  async componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }
  }

  render() {
    const { profile, currentUser, isMobile } = this.props;

    return (
      <Page
        headerProps={{
          renderSubheader: () => {
            if (isMobile) {
              return (
                <Subheader bottom center padding="large" fade>
                  <Button
                    onClick={this.props.loadNextPage}
                    icon={<Icon type="shuffle" />}
                    size="large"
                    color="green"
                  >
                    Next person
                  </Button>
                </Subheader>
              );
            } else {
              const url = buildProfileShareURL(profile.id);
              return (
                <Subheader padding="normal" bottom spaceBetween>
                  <div className="ShareSection">
                    <CopyURLForm size="small" url={url} />

                    <div className="ShareButtons">
                      <SharableSocialLink
                        provider="twitter"
                        width="32px"
                        height="32px"
                        url={url}
                      />

                      <SharableSocialLink
                        provider="facebook"
                        width="32px"
                        height="32px"
                        url={url}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={this.props.loadNextPage}
                    icon={<Icon type="shuffle" />}
                  >
                    Next person
                  </Button>
                </Subheader>
              );
            }
          }
        }}
      >
        <Head
          disableGoogle
          mobileURL={buildMobileShuffleURL()}
          title={`${profile.name} Apply to Date`}
          description={profile.tagline}
          favicon={_.sample(profile.photos)}
          username={profile.id}
          type="profile"
          ogImage={_.first(profile.photos)}
        />

        <ProfileComponent
          profile={profile}
          isMobile={isMobile}
          onScrollEnterAskButton={this.enableStickyHeader}
          onScrollLeaveAskButton={this.disableStickyHeader}
        />

        <style jsx>{`
          .ShareSection {
            display: grid;
            grid-template-columns: auto auto;
            grid-auto-flow: column dense;
            grid-column-gap: 28px;
            align-items: center;
          }

          .ShareButtons {
            display: grid;
            grid-template-columns: auto auto;
            grid-auto-flow: column dense;
            grid-column-gap: 14px;
            align-items: center;
          }
        `}</style>
      </Page>
    );
  }
}

class ShuffleGate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingProfile: true,
      profileId: null,
      status: SHUFFLE_PAGE_STATUS.loading
    };
  }

  async componentDidMount() {
    this.loadProfile(this.props);
  }

  loadProfile = async props => {
    const { currentUser = {} } = props;

    const excludedProfiles = await Storage.shuffledProfiles();
    const profileResponse = await shuffleProfile({
      interested_in_men: _.get(currentUser, "interestedInMen", true),
      interested_in_women: _.get(currentUser, "interestedInWomen", true),
      interested_in_other: _.get(currentUser, "interestedInOther", true),
      sex: _.get(currentUser, "sex", undefined),
      exclude: Array.from(excludedProfiles)
    });

    this.props.updateEntities(profileResponse.body);
    const profileId = _.get(profileResponse, "body.data.id", null);
    const isShuffleCooldown = _.get(
      profileResponse,
      "body.meta.shuffle_disabled",
      false
    );

    if (isShuffleCooldown) {
      logEvent("Shuffle Cooldown");
    } else {
      logEvent("Shuffle");
    }

    this.setState({
      profileId: isShuffleCooldown ? null : profileId,
      status: isShuffleCooldown
        ? SHUFFLE_PAGE_STATUS.cooldown
        : SHUFFLE_PAGE_STATUS.loaded
    });

    window.scrollTo(0, 0);
  };

  handleLoadNextPage = async () => {
    const { profileId } = this.state;
    await Storage.addShuffledProfile(profileId);

    this.setState({
      status: SHUFFLE_PAGE_STATUS.loading,
      profileId: null
    });
    this.loadProfile(this.props);
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.loginStatus === LOGIN_STATUSES.checking &&
      nextProps.loginStatus === LOGIN_STATUSES.loggedIn &&
      !this.state.profileId &&
      !SHUFFLE_PAGE_STATUS.loading
    ) {
      this.loadProfile(this.props);
    }
  }

  render() {
    if (this.state.status === SHUFFLE_PAGE_STATUS.loading) {
      return <Page isLoading />;
    } else if (
      this.state.status === SHUFFLE_PAGE_STATUS.loaded &&
      this.state.profileId
    ) {
      const profile = this.props.profile[this.state.profileId];
      return (
        <ShuffleProfile
          {...this.props}
          profile={profile}
          loadNextPage={this.handleLoadNextPage}
        />
      );
    } else {
      return (
        <EmptyPage
          title="That's it for now!"
          description="To unlock more recommendations, help matchmake other people or come back later."
          graphic={<MatchmakePreviewGraphic isMobile={this.props.isMobile} />}
          actions={
            <Link route="/matchmake">
              <Button
                size="large"
                icon={<Icon type="matchmake" size="18px" color="white" />}
              >
                Start matchmaking
              </Button>
            </Link>
          }
          footerText={<Text type="link">Learn more about matchmaking</Text>}
        />
      );
    }
  }
}

const ProfileWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      profile: state.profile
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch),
  null,
  {
    pure: false
  }
)(LoginGate(ShuffleGate, { loginRequired: true }));

export default ProfileWithStore;
