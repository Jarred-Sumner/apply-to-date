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
import InlineApply from "../components/profile/InlineApply";
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

const SECTION_ORDERING = ["introduction", "why"];

const SECTION_LABELS = {
  introduction: "Introduction",
  why: "Why I want to go on a date with you"
};

const getSectionPlaceholder = (key, profile) => {
  return {
    introduction: `Tell ${
      profile.name
    } a little about you. Stand out from the crowd with a good introduction.`,
    why: `Tell ${profile.name} why you want to go on a date with them.`
  }[key];
};

const ROWS_BY_SECTION = {
  introduction: 4,
  why: 6
};

const getWidthForText = (text, isPlaceholder) => {
  if (isPlaceholder) {
    return `${Math.max((text.length + 1) * 21, 22)}px`;
  } else {
    return `${Math.max(text.length * 20.5, 22)}px`;
  }
};

class CreateApplication extends React.Component {
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

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false,
      isSavingProfile: false,
      name: "",
      tagline: "",
      photos: [],
      socialLinks: {},
      sections: {
        introduction: "",
        why: ""
      }
    };
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
      ..._.pick(this.state, ["name", "tagline", "photos", "sections"])
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
        placeholder: getSectionPlaceholder(section, this.props.profile),
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
    const { name, photos, socialLinks } = this.state;

    return (
      <Page>
        <Head />

        <section className="Section Section--center Section--title">
          <div className="Section-row">
            <Text type="ProfilePageTitle">
              👋 Hi {profile.name}, I'm{" "}
              <EditableText
                value={name}
                onChange={this.setName}
                placeholder="Your Name"
                type="ProfilePageTitle"
                width={getWidthForText(name || "Your Name", !name)}
              />
            </Text>
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

        <section className="Section Section--apply">
          <Button onClick={this.applyForDate}>Submit application</Button>
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

          .ApplicationForm {
            width: 40rem;
            margin-left: auto;
            margin-right: auto;
          }

          .PhotosContainer {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            grid-column-gap: 28px;
          }

          .Section--socialLinks {
            display: grid;
            justify-content: center;
            margin-left: auto;
            padding-left: 18px;
            padding-right: 18px;
            margin-right: auto;
            grid-auto-flow: column;
            grid-column-gap: 32px;
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

const CreateApplicationWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      profile: state.profile[props.url.query.id]
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(CreateApplication));

export default CreateApplicationWithStore;
