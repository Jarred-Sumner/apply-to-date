import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getProfile, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Header from "../components/profile/Header";
import Text from "../components/Text";
import InlineApply from "../components/profile/InlineApply";
import Lightbox from "react-images";
import _ from "lodash";
import titleCase from "title-case";

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
      currentPhotoIndex: null
    };
  }

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
        <Header profile={this.props.profile} />

        <section className="Section Section--center Section--title">
          <div className="Section-row">
            <Text font="serif" size="30px" type="pageTitle" weight="bold">
              👋 Hi, I'm {titleCase(profile.name)}.
            </Text>
          </div>

          <div className="Section-row">
            <Text font="sans-serif">{profile.tagline}</Text>
          </div>

          <div className="Section-row ApplicationForm">
            <InlineApply profileId={this.props.profile.id} />
          </div>
        </section>

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
                <Text type="title" font="serif" size="30px" weight="bold">
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
            max-width: 1080px;
          }

          .Section-row {
            grid-row: 1fr;
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
            grid-column-gap: 2rem;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            margin-left: auto;
            text-align: center;
          }

          .Section--photos .photo {
            vertical-align: top;
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
