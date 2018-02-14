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

const SECTION_ORDERING = [
  "introduction",
  "background",
  "looking-for",
  "not-looking-for"
];

const SECTION_LABELS = {
  introduction: "Introduction",
  background: "Background",
  "looking-for": "Looking for",
  "not-looking-for": "Not looking for"
};

class Profile extends React.Component {
  static async getInitialProps({ query, store, req, isServer }) {
    const profileResponse = await getProfile(query.id);

    store.dispatch(updateEntities(profileResponse.body));
  }

  constructor(props) {
    super(props);

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false
    };
  }

  enableStickyHeader = () => this.setState({ isHeaderSticky: true });
  disableStickyHeader = () => this.setState({ isHeaderSticky: false });

  paragraphs = () => {
    const { sections } = this.props.profile;

    const filledSections = _.keys(sections).filter(key => !!sections[key]);

    return _.sortBy(filledSections, key => SECTION_ORDERING.indexOf(key)).map(
      section => ({
        title: SECTION_LABELS[section],
        body: sections[section]
      })
    );
  };

  render() {
    const { profile, currentUser } = this.props;
    return (
      <Page
        renderMessage={() =>
          _.get(currentUser, "username") === profile.id &&
          !profile.visible && (
            <MessageBar>
              <Text size="14px" color="white" lineHeight="19px">
                Your profile is hidden from others until you{" "}
                <Link href={`/${profile.id}/edit`}>
                  <a>go live</a>
                </Link>
              </Text>
            </MessageBar>
          )
        }
        headerProps={{
          showChildren: this.state.isHeaderSticky,
          children: (
            <div className="HeaderForm">
              <InlineApply profileId={this.props.profile.id} />
            </div>
          )
        }}
      >
        <Head />
        <Waypoint
          onEnter={this.disableStickyHeader}
          onLeave={this.enableStickyHeader}
        >
          <section className="Section Section--center Section--title">
            <div className="Section-row">
              <Text type="ProfilePageTitle">
                👋 Hi, I'm {titleCase(profile.name)}.
              </Text>
            </div>

            <div className="Section-row">
              <Text type="Tagline">{profile.tagline}</Text>
            </div>

            <SocialLinkList socialLinks={profile.socialLinks} />

            <div className="Section-row ApplicationForm">
              <InlineApply profileId={this.props.profile.id} />
            </div>
          </section>
        </Waypoint>

        <section className="Section">
          <PhotoGroup size="100%" photos={profile.photos} />
        </section>

        <section className="Section Section--bio">
          {this.paragraphs().map(paragraph => {
            return (
              <div
                key={paragraph.title}
                className="Section-row Section-row--bio"
              >
                <Text className="Section-title" type="title">
                  {paragraph.title}
                </Text>
                <Text type="paragraph">{paragraph.body}</Text>
              </div>
            );
          })}
        </section>
        <style jsx>{`
          .Section {
            margin-top: 4rem;

            display: grid;
            grid-row-gap: 2rem;
            max-width: 100%;
          }

          .HeaderForm {
            margin-left: auto;
            margin-right: auto;
            width: 50%;
          }

          .Section-row {
            grid-row: 1fr;
          }

          .Section-title {
            margin-bottom: 14px;
          }

          .Section-tagline {
            font-size: 18px;
          }

          .Section-row--bio {
            display: grid;
            grid-row-gap: 1rem;
          }

          .Section--center {
            text-align: center;
          }

          .ApplicationForm {
            max-width: 40rem;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
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
      profile: state.profile[props.url.query.id]
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(Profile));

export default ProfileWithStore;
