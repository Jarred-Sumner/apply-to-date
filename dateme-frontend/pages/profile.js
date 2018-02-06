import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getProfile, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Header from "../components/Header";
import Text from "../components/Text";
import InlineApply from "../components/profile/InlineApply";
import Lightbox from "react-images";
import _ from "lodash";
import titleCase from "title-case";
import Waypoint from "react-waypoint";
import Button from "../components/Button";

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
  static async getInitialProps({ query, store }) {
    const profileResponse = await getProfile(query.id);
    const userResponse = await getCurrentUser();

    store.dispatch(updateEntities(profileResponse.body));

    if (userResponse.body.data) {
      store.dispatch(setCurrentUser(userResponse.body.data.id));
      store.dispatch(updateEntities(userResponse.body));
    }
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

  setCurrentPhoto = url => {
    this.setState({
      currentPhotoIndex: this.props.profile.photos.indexOf(url)
    });
  };

  closeLightbox = () => this.setState({ currentPhotoIndex: null });

  nextPhoto = () => {
    const { photos } = this.props.profile;
    const { currentPhotoIndex } = this.state;
    if (photos.length > currentPhotoIndex + 1) {
      this.setState({
        currentPhotoIndex: currentPhotoIndex + 1
      });
    } else {
      this.setState({
        currentPhotoIndex: 0
      });
    }
  };

  previousPhoto = () => {
    const { photos } = this.props.profile;
    const { currentPhotoIndex } = this.state;
    if (currentPhotoIndex - 1 > 0) {
      this.setState({
        currentPhotoIndex: currentPhotoIndex - 1
      });
    } else {
      this.setState({
        currentPhotoIndex: 0
      });
    }
  };

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
    const { profile } = this.props;

    return (
      <div>
        <Head />
        <Header showChildren={this.state.isHeaderSticky}>
          <div className="HeaderForm">
            <InlineApply profileId={this.props.profile.id} />
          </div>
        </Header>

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

            <div className="Section-row ApplicationForm">
              <InlineApply profileId={this.props.profile.id} />
            </div>
          </section>
        </Waypoint>
        <section className="Section Section--photos">
          {profile.photos.slice(0, 3).map(url => (
            <div
              className="photo"
              key={url}
              onClick={() => this.setCurrentPhoto(url)}
            >
              <img src={url} />
            </div>
          ))}

          <Lightbox
            images={profile.photos.slice(0, 3).map(src => ({ src }))}
            isOpen={_.isNumber(this.state.currentPhotoIndex)}
            currentImage={this.state.currentPhotoIndex || 0}
            onClickPrev={this.previousPhoto}
            onClickNext={this.nextPhoto}
            onClose={this.closeLightbox}
          />
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
            margin-left: auto;
            margin-right: auto;
            display: grid;
            grid-row-gap: 2rem;
            max-width: 710px;
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
            width: 40rem;
            margin-left: auto;
            margin-right: auto;
          }

          .Section--photos {
            align-items: flex-start;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
          }

          .Section--photos .photo {
            flex: 1;
            margin-right: 2em;
            align-self: flex-start;
            max-width: 400px;
          }

          .Section--photos .photo:last-child {
            margin-right: 0;
          }

          .Section--photos .photo img {
            width: 100%;
            object-fit: contain;
            background: #d8d8d8;
            box-shadow: 0 0 20px 0 rgba(160, 160, 160, 0.5);
            border-radius: 6px;
            cursor: pointer;
            transition: transform 0.1s linear;
          }

          .Section--photos .photo img:hover {
            transform: scale(1.05, 1.05);
          }
        `}</style>
      </div>
    );
  }
}

const ProfileWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      profile: state.profile[props.url.query.id],
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(Profile);

export default ProfileWithStore;
