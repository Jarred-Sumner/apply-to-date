import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import Router from "next/router";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getProfile, getCurrentUser, updateProfile } from "../api";
import { bindActionCreators } from "redux";
import Header from "../components/Header";
import Text from "../components/Text";
import EditableText from "../components/EditableText";
import TextArea from "../components/TextArea";
import Lightbox from "react-images";
import _ from "lodash";
import titleCase from "title-case";
import Waypoint from "react-waypoint";
import Button from "../components/Button";
import Alert, { handleApiError } from "../components/Alert";
import LoginGate from "../components/LoginGate";
import Photo from "../components/EditProfile/Photo";
import Page from "../components/Page";
import EditSocialLinks from "../components/EditSocialLinks";

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

const SECTION_PLACEHOLDERS = {
  introduction:
    "Give a short summary of yourself and what you’re looking for. This should be a longer version of your TLDR.",
  background:
    "Give some background about yourself (optional), in more detail than your introduction",
  "looking-for":
    "Tell your applicants what you're looking for (e.g. a girl/boyfriend, or just a date for an event)",
  "not-looking-for":
    "Tell your applicants what you're NOT looking for (e.g. no hookups)"
};

const ROWS_BY_SECTION = {
  introduction: 4,
  background: 6,
  "looking-for": 3,
  "not-looking-for": 3
};

const getWidthForText = (text, isPlaceholder) => {
  if (isPlaceholder) {
    return `${Math.max((text.length + 1) * 21, 22)}px`;
  } else {
    return `${Math.max(text.length * 20.5, 22)}px`;
  }
};

class Profile extends React.Component {
  static async getInitialProps({ query, store, req, isServer }) {
    try {
      const profileResponse = await getProfile(query.id);
      store.dispatch(updateEntities(profileResponse.body));
    } catch (exception) {
      console.error(exception);
    }
  }

  constructor(props) {
    super(props);

    const profile = props.profile || {};
    const {
      name = "",
      tagline = "",
      photos = [],
      sections = {},
      socialLinks = {}
    } = profile;

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false,
      isSavingProfile: false,
      name,
      tagline,
      photos,
      sections,
      socialLinks
    };
  }

  componentWillMount() {
    if (!this.props.profile) {
      Router.push("/404");
    } else if (this.props.profile.userId !== this.props.currentUser.id) {
      Router.replace(
        "/" + encodeURIComponent(this.props.profile.id) + "?error=readonly"
      );
    }
  }

  handleSaveProfile = async () => {
    if (this.state.isSavingProfile) {
      return;
    }

    this.setState({
      isSavingProfile: true
    });

    const profile = updateProfile({
      id: this.props.profile.id,
      ..._.pick(this.state, [
        "name",
        "tagline",
        "photos",
        "sections",
        "socialLinks"
      ])
    })
      .then(response => {
        this.props.updateEntities(response.body);
        Alert.success("Updated your site successfully!");
      })
      .catch(error => {
        handleApiError(error);
      })
      .finally(() => {
        this.setState({ isSavingProfile: false });
      });
  };

  enableStickyHeader = () => this.setState({ isHeaderSticky: true });
  disableStickyHeader = () => this.setState({ isHeaderSticky: false });

  setCurrentPhoto = url => {
    this.setState({
      currentPhotoIndex: this.props.profile.photos.indexOf(url)
    });
  };

  paragraphs = () => {
    const { sections } = this.state;

    return _.sortBy(_.keys(sections), key => SECTION_ORDERING.indexOf(key)).map(
      section => ({
        title: SECTION_LABELS[section],
        key: section,
        rows: ROWS_BY_SECTION[section],
        placeholder: SECTION_PLACEHOLDERS[section],
        body: sections[section] || ""
      })
    );
  };

  setSectionText = title => value => {
    this.setState({
      sections: {
        ...this.state.sections,
        [title]: value
      }
    });
  };

  setName = evt => this.setState({ name: evt.target.value });
  setTagline = evt => this.setState({ tagline: evt.target.value });
  setPhotoAtIndex = index => url => {
    const photos = this.state.photos.slice();
    photos.splice(index, 1, url);

    this.setState({ photos: photos });
  };

  render() {
    const { profile } = this.props;
    const { name, tagline, photos, socialLinks } = this.state;

    return (
      <Page
        headerProps={{
          renderSubheader: () => {
            return (
              <div className="Subheader">
                <div className="Subheader--buttons">
                  <Button href={`/${profile.id}`} color="green" fill={false}>
                    View site
                  </Button>
                  <Button
                    componentType="div"
                    color="green"
                    pending={this.state.isSavingProfile}
                    onClick={this.handleSaveProfile}
                  >
                    Save
                  </Button>
                </div>
              </div>
            );
          }
        }}
      >
        <Head />
        <section className="Section Section--center Section--title">
          <div className="Section-row">
            <Text type="ProfilePageTitle">
              👋 Hi, I'm{" "}
              <EditableText
                value={name}
                onChange={this.setName}
                placeholder="Your Name"
                type="ProfilePageTitle"
                width={getWidthForText(name || "Your Name", !name)}
              />
            </Text>
          </div>

          <div className="Section-row Section-row--Tagline">
            <EditableText
              placeholder="Enter a short TLDR of yourself"
              type="Tagline"
              value={tagline}
              maxLength={74}
              onChange={this.setTagline}
              maxWidth="640px"
              width={"640px"}
            />
          </div>

          <div className="Section-row">
            <EditSocialLinks
              socialLinks={socialLinks}
              setSocialLinks={socialLinks => this.setState({ socialLinks })}
            />
          </div>
        </section>

        <section className="Section Section--photos">
          <Text type="label">Share some pics</Text>
          <div className="PhotosContainer">
            <Photo
              key={photos[0] || 0}
              url={photos[0]}
              setURL={this.setPhotoAtIndex(0)}
            />
            <Photo
              key={photos[1] || 1}
              url={photos[1]}
              setURL={this.setPhotoAtIndex(1)}
            />
            <Photo
              key={photos[2] || 2}
              url={photos[2]}
              setURL={this.setPhotoAtIndex(2)}
            />
          </div>

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
              <div key={paragraph.key} className="Section-row Section-row--bio">
                <Text className="Section-title" type="title">
                  {paragraph.title}
                </Text>
                <TextArea
                  name={paragraph.key}
                  rows={paragraph.rows}
                  value={paragraph.body}
                  placeholder={paragraph.placeholder}
                  onChange={this.setSectionText(paragraph.key)}
                  type="paragraph"
                />
              </div>
            );
          })}
        </section>
        <style jsx>{`
          .Section {
            margin-top: 4rem;
            display: grid;
            grid-row-gap: 2rem;
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

          .PhotosContainer {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            grid-column-gap: 28px;
          }

          .Subheader {
            background-color: white;
            display: flex;
            align-items: center;
            padding: 10px 40px;
            width: auto;
            border-bottom: 1px solid #e8e8e8;
          }

          .Subheader--buttons {
            margin-left: auto;
            display: grid;
            grid-template-columns: auto auto;
            grid-column-gap: 14px;
            grid-template-rows: 1fr;
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
)(
  LoginGate(Profile, {
    loginRequired: true
  })
);

export default ProfileWithStore;
