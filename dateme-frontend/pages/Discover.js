import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import {
  getProfile,
  getCurrentUser,
  withCookies,
  discoverProfile
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
import ProfileComponent from "../components/Profile";
import Storage from "../lib/Storage";

const SeeAnotherPageButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} size="large" color="green">
      Next person
    </Button>
  );
};

class DiscoverProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false
    };
  }

  componentWillMount() {
    this.isMobile = getMobileDetect().mobile();
  }

  async componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }
  }

  render() {
    const { profile, currentUser } = this.props;

    return (
      <Page
        headerProps={{
          showChildren: this.state.isHeaderSticky && !this.isMobile,
          renderSubheader:
            this.isMobile &&
            (() => {
              return (
                <Subheader bottom center padding="large" fade>
                  <SeeAnotherPageButton onClick={this.props.loadNextPage} />
                </Subheader>
              );
            }),
          children: !this.isMobile && (
            <div className="HeaderApply">
              <SeeAnotherPageButton onClick={this.props.loadNextPage} />
            </div>
          )
        }}
      >
        <Head
          disableGoogle
          url={buildProfileURL(profile.id)}
          title={`Apply to date ${profile.name || ""}`}
          description={profile.tagline}
          favicon={_.sample(profile.photos)}
          username={profile.id}
          type="profile"
          ogImage={_.first(profile.photos)}
        />

        <ProfileComponent
          profile={profile}
          onScrollEnterAskButton={this.enableStickyHeader}
          onScrollLeaveAskButton={this.disableStickyHeader}
        />
      </Page>
    );
  }
}

class ProfileGate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingProfile: true,
      profileId: null
    };
  }

  async componentDidMount() {
    this.loadProfile(this.props);
  }

  loadProfile = async props => {
    const { currentUser = {} } = props;

    const excludedProfiles = await Storage.discoveredProfiles();
    const profileResponse = await discoverProfile({
      interested_in_men: _.get(currentUser, "interestedInMen", true),
      interested_in_women: _.get(currentUser, "interestedInWomen", true),
      interested_in_other: _.get(currentUser, "interestedInOther", true),
      sex: _.get(currentUser, "sex", undefined),
      exclude: Array.from(excludedProfiles)
    });

    this.props.updateEntities(profileResponse.body);
    const profileId = _.get(profileResponse, "body.data.id", null);

    this.setState({
      profileId: profileId,
      isLoadingProfile: false
    });

    Storage.addDiscoveredProfile(profileId);
  };

  handleLoadNextPage = async () => {
    const { profileId } = this.state;
    await Storage.addDiscoveredProfile(profileId);

    this.setState({
      isLoadingProfile: true,
      profileId: null
    });
    this.loadProfile(this.props);
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.loginStatus === LOGIN_STATUSES.checking &&
      nextProps.loginStatus === LOGIN_STATUSES.loggedIn &&
      !this.state.profileId &&
      !this.state.isLoadingProfile
    ) {
      this.loadProfile(this.props);
    }
  }

  render() {
    if (this.state.isLoadingProfile) {
      return <Page isLoading />;
    } else if (this.state.profileId) {
      const profile = this.props.profile[this.state.profileId];
      return (
        <DiscoverProfile
          {...this.props}
          profile={profile}
          loadNextPage={this.handleLoadNextPage}
        />
      );
    } else {
      return <Page>TODO empty</Page>;
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
)(LoginGate(ProfileGate));

export default ProfileWithStore;
