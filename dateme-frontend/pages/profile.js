import { Link } from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import {
  updateEntities,
  setCurrentUser,
  initStore,
  applicationsByProfile
} from "../redux/store";
import {
  getProfile,
  getCurrentUser,
  withCookies,
  incrementProfileViewCount
} from "../api";
import { bindActionCreators } from "redux";
import Header from "../components/Header";
import LoginGate from "../components/LoginGate";
import Text from "../components/Text";
import Icon from "../components/Icon";
import InlineApply from "../components/profile/InlineApply";
import _ from "lodash";
import titleCase from "title-case";
import Waypoint from "react-waypoint";
import Button from "../components/Button";
import AskProfileOutButton from "../components/AskProfileOutButton";
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
  buildMobileViewProfileURL
} from "../lib/routeHelpers";
import { getMobileDetect } from "../lib/Mobile";
import Subheader from "../components/Subheader";
import { animateScroll } from "react-scroll";
import Linkify from "react-linkify";
import ProfileComponent from "../components/Profile";
import ReactPixel from "react-facebook-pixel";
import { logEvent } from "../lib/analytics";
import { hasMobileAppInstalled } from "../lib/applyMobileCookie";

class Profile extends React.Component {
  static async getInitialProps({ query, store, req, isServer }) {
    const profileResponse = await getProfile(decodeURI(query.id));
    const profileId = _.get(profileResponse, "body.data.id");
    store.dispatch(updateEntities(profileResponse.body));
    return { profileId };
  }

  constructor(props) {
    super(props);

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false,
      selectedElementId:
        typeof window !== "undefined"
          ? window.location.hash.split("#")[1]
          : null
    };
  }

  async componentDidMount() {
    this.isMobile = getMobileDetect().mobile();

    let profile = this.props.profile;
    if (!profile) {
      const profileResponse = await getProfile(this.props.profileId);
      this.props.updateEntities(profileResponse.body);

      if (!_.get(profileResponse, "body.data.id")) {
        Router.replaceRoute("/page-not-found", "/page-not-found");
        return;
      }

      profile = profileResponse.body.data;
    }

    incrementProfileViewCount(profile.id).then(_.noop, _.noop);

    logEvent("View Profile", {
      profile: profile.id,
      featured: profile.featured || false
    });

    ReactPixel.track("ViewContent", {
      content_name: profile.name,
      content_category: "Profile",
      content_ids: [profile.id]
    });

    this.setSelectedElementId();
    window.addEventListener("hashchange", this.setSelectedElementId);
  }

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("hashchange", this.setSelectedElementId);
    }
  }

  setSelectedElementId = evt => {
    if (evt) {
      evt.preventDefault();
    }

    window.setTimeout(() => {
      const selectedElementClassName = window.location.hash.split("#")[1];
      if (selectedElementClassName) {
        const element = document.querySelector(
          `.Highlight--${selectedElementClassName}`
        );

        if (!element) {
          return;
        }

        const offset = element.getBoundingClientRect().top;
        const HEADER_OFFSET = 70;
        const PADDING = 28;
        animateScroll.scrollMore(offset - HEADER_OFFSET - PADDING);
        this.setState({ selectedElementId: selectedElementClassName });
      }
    }, 10);
  };

  enableStickyHeader = () => this.setState({ isHeaderSticky: true });
  disableStickyHeader = () => this.setState({ isHeaderSticky: false });

  render() {
    const { profile, currentUser, isMobile, application } = this.props;
    if (!profile) {
      return <Page isLoading />;
    }

    return (
      <Page
        renderMessage={() => {
          if (
            _.get(currentUser, "username") === profile.id &&
            !profile.visible
          ) {
            return (
              <MessageBar>
                <Text size="14px" color="white" lineHeight="19px">
                  Your profile is hidden from others until you{" "}
                  <Link route={buildEditProfileURL(profile.id)}>
                    <a>go live</a>
                  </Link>
                </Text>
              </MessageBar>
            );
          } else {
            return null;
          }
        }}
        headerProps={{
          renderSubheader:
            isMobile &&
            this.state.isHeaderSticky &&
            (() => {
              return (
                <Subheader bottom center padding="large" fade>
                  <AskProfileOutButton profile={profile} />
                </Subheader>
              );
            }),
          children:
            this.state.isHeaderSticky && !isMobile ? (
              <div className="HeaderApply">
                <AskProfileOutButton profile={profile} />
              </div>
            ) : null
        }}
      >
        <Head
          disableGoogle
          mobileURL={buildMobileViewProfileURL(profile.id)}
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
          isMobile={isMobile}
          application={application}
          onScrollEnterAskButton={this.disableStickyHeader}
          onScrollLeaveAskButton={this.enableStickyHeader}
        />

        <style jsx>{`
          .HeaderApply {
            max-width: 190px;
            margin-left: auto;
            margin-right: auto;
          }
        `}</style>
        <style jsx global>{`
          .Highlight--${this.state.selectedElementId} {
            background-color: rgba(255, 219, 87, 1);
            animation: show-selected-element 5s linear;
            animation-fill-mode: forwards;
          }

          a.LinkifyLink,
          a.LinkifyLink:visited {
            color: #109877 !important;
            text-decoration: none !important;
          }

          a.LinkifyLink:hover {
            color: #109877;
          }

          @keyframes show-selected-element {
            0% {
              background-color: rgba(255, 219, 87, 1);
            }

            50% {
              background-color: rgba(255, 219, 87, 0.5);
            }

            100% {
              background-color: transparent;
            }
          }
        `}</style>
      </Page>
    );
  }
}

const ProfileWithStore = withRedux(
  initStore,
  (state, props) => {
    const profile =
      state.profile[props.profileId || decodeURI(props.url.query.id)];
    return {
      profile,
      application: _.first(applicationsByProfile(state)[_.get(profile, "id")])
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(Profile));

export default ProfileWithStore;
