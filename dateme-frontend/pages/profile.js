import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getProfile, getCurrentUser, withCookies } from "../api";
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
import { buildProfileURL, buildEditProfileURL } from "../lib/routeHelpers";
import { getMobileDetect } from "../lib/Mobile";
import Subheader from "../components/Subheader";
import { animateScroll } from "react-scroll";
import Linkify from "react-linkify";
import ProfileComponent from "../components/Profile";
import { logEvent } from "../lib/analytics";

class Profile extends React.Component {
  static async getInitialProps({ query, store, req, isServer }) {
    const profileResponse = await getProfile(query.id);

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

    this.isMobile = false;
  }

  async componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }

    this.isMobile = getMobileDetect().mobile();

    const profileResponse = await getProfile(this.props.profileId);

    this.props.updateEntities(profileResponse.body);

    if (!_.get(profileResponse, "body.data.id")) {
      Router.replaceRoute("/page-not-found", "/page-not-found");
    }

    logEvent("View Profile", {
      profile: this.props.profileId,
      featured: _.get(profileResponse, "body.data.featured", false)
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
    const { profile, currentUser } = this.props;
    if (!profile) {
      return <Page isLoading />;
    }

    return (
      <Page
        renderMessage={() =>
          _.get(currentUser, "username") === profile.id &&
          !profile.visible && (
            <MessageBar>
              <Text size="14px" color="white" lineHeight="19px">
                Your profile is hidden from others until you{" "}
                <Link href={buildEditProfileURL(profile.id)}>
                  <a>go live</a>
                </Link>
              </Text>
            </MessageBar>
          )
        }
        headerProps={{
          showChildren: this.state.isHeaderSticky && !this.isMobile,
          renderSubheader:
            this.isMobile &&
            this.state.isHeaderSticky &&
            (() => {
              return (
                <Subheader bottom center padding="large" fade>
                  <AskProfileOutButton profile={profile} />
                </Subheader>
              );
            }),
          children: (
            <div className="HeaderApply">
              <AskProfileOutButton profile={profile} />
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
          onScrollEnterAskButton={this.disableStickyHeader}
          onScrollLeaveAskButton={this.enableStickyHeader}
        />

        <style jsx>{`
          .HeaderApply {
            position: absolute;
            left: 0;
            right: 0;
            width: min-content;
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
    return {
      profile: state.profile[props.profileId || decodeURI(props.url.query.id)]
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch),
  null,
  {
    pure: false
  }
)(LoginGate(Profile));

export default ProfileWithStore;
