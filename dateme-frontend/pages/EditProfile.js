import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import Router from "next/router";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import {
  getProfile,
  getCurrentUser,
  updateProfile,
  getVerifications
} from "../api";
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
import VerifyNetworksSection from "../components/VerifyNetworksSection";

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

class VerifySocialNetworksContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      externalAuthentications: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    const response = await getVerifications();

    this.setState({
      externalAuthentications: response.body.data,
      isLoading: false
    });
  }

  componentWillReceiveProps(props) {
    if (props.externalAuthentications !== this.props.externalAuthentications) {
      this.setState({
        externalAuthentications: props.externalAuthentications
      });
    }
  }

  setExternalAuthentications = externalAuthentications => {
    this.props.setExternalAuthentications(externalAuthentications);
  };

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <VerifyNetworksSection
        recommendedContactMethod={this.props.recommendedContactMethod}
        setRecommendedContactMethod={this.props.setRecommendedContactMethod}
        phone={this.props.phone}
        setPhone={this.props.setPhone}
        externalAuthentications={this.state.externalAuthentications}
        save={() => this.props.onSave(false)}
        whitelist={["twitter", "facebook", "instagram", "phone"]}
        setExternalAuthentications={this.setExternalAuthentications}
      />
    );
  }
}

class Profile extends React.Component {
  constructor(props) {
    super(props);

    const profile = props.profile || {};
    const {
      name = "",
      tagline = "",
      photos = [],
      socialLinks = {},
      recommendedContactMethod = "phone",
      phone = "",
      sections: profileSections
    } = profile;

    const sections = _.fromPairs(
      SECTION_ORDERING.map(key => [key, profileSections[key] || ""])
    );

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false,
      isSavingProfile: false,
      name,
      tagline,
      photos,
      phone,
      sections,
      socialLinks,
      recommendedContactMethod: recommendedContactMethod || "phone",
      externalAuthentications: null
    };
  }

  handleSaveProfile = async (showAlert = true) => {
    const {
      isSavingProfile,
      name,
      socialLinks,
      tagline,
      photos,
      sections,
      externalAuthentications,
      phone,
      recommendedContactMethod
    } = this.state;

    if (isSavingProfile) {
      return;
    }

    this.setState({
      isSavingProfile: true
    });

    return updateProfile({
      id: this.props.profile.id,
      name: name !== this.props.profile.name ? name : undefined,
      tagline: tagline !== this.props.profile.tagline ? tagline : undefined,
      photos: !_.isEqual(photos, this.props.profile.photos)
        ? photos
        : undefined,
      phone: phone !== this.props.profile.phone ? phone : undefined,
      recommended_contact_method:
        recommendedContactMethod !== this.props.profile.recommendedContactMethod
          ? recommendedContactMethod
          : undefined,
      sections: _.isEqual(sections, this.props.profile.sections)
        ? undefined
        : sections,
      external_authentications:
        externalAuthentications === null
          ? undefined
          : externalAuthentications.map(({ id }) => id),
      social_links: _.isEqual(socialLinks, this.props.profile.socialLinks)
        ? undefined
        : socialLinks
    })
      .then(response => {
        this.props.updateEntities(response.body);
        if (showAlert) {
          Alert.success("Updated your site successfully!");
        }

        return response.body;
      })
      .catch(error => {
        handleApiError(error);

        return false;
      })
      .finally(response => {
        this.setState({ isSavingProfile: false });

        return response;
      });
  };

  enableStickyHeader = () => this.setState({ isHeaderSticky: true });
  disableStickyHeader = () => this.setState({ isHeaderSticky: false });
  setPhone = phone => this.setState({ phone });

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

  setRecommendedContactMethod = recommendedContactMethod =>
    this.setState({ recommendedContactMethod });
  setExternalAuthentications = externalAuthentications =>
    this.setState({ externalAuthentications });
  setName = evt => this.setState({ name: evt.target.value });
  setTagline = evt => this.setState({ tagline: evt.target.value });
  setPhotoAtIndex = index => url => {
    const photos = this.state.photos.slice();
    photos.splice(index, 1, url);

    this.setState({ photos: photos });
  };

  render() {
    const { profile } = this.props;
    const {
      name,
      tagline,
      photos,
      socialLinks,
      phone,
      externalAuthentications,
      recommendedContactMethod
    } = this.state;

    if (!profile) {
      return null;
    }

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
        </section>

        <section className="Section Section-row--Tagline">
          <EditableText
            placeholder="Enter a short TLDR of yourself"
            type="Tagline"
            value={tagline}
            maxLength={74}
            onChange={this.setTagline}
            maxWidth="100%"
            width={"100%"}
          />
        </section>

        <section className="Section Section--center">
          <div className="TextGroup">
            <Text type="title">I prefer to be contacted by</Text>
            <Text>
              This will not be displayed publicly. Only your matches will
              receive this.
            </Text>
          </div>

          <div className="Verify">
            <VerifySocialNetworksContainer
              externalAuthentications={externalAuthentications}
              recommendedContactMethod={recommendedContactMethod}
              setRecommendedContactMethod={this.setRecommendedContactMethod}
              setExternalAuthentications={this.setExternalAuthentications}
              onSave={this.handleSaveProfile}
              setPhone={this.setPhone}
              phone={phone}
            />
          </div>
        </section>

        <section className="Section">
          <div className="TextGroup">
            <Text type="title">Public social media</Text>
            <Text wrap>
              Public profiles you want displayed on your page.{" "}
              <strong>Anyone can see these:</strong>
            </Text>
          </div>
          <EditSocialLinks
            socialLinks={socialLinks}
            setSocialLinks={socialLinks => this.setState({ socialLinks })}
          />
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

          .TextGroup {
            display: grid;
            grid-row-gap: 18px;
            text-align: center;
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

          .Verify {
            margin-left: auto;
            margin-right: auto;
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
    const currentUser = state.user[state.currentUserId];

    if (currentUser) {
      return {
        profile: currentUser.profile
      };
    } else {
      return {
        profile: null
      };
    }
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(
  LoginGate(Profile, {
    loginRequired: true
  })
);

export default ProfileWithStore;
