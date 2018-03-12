import { Link } from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import { Router } from "../routes";
import withRedux from "next-redux-wrapper";
import classNames from "classnames";
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
import _ from "lodash";
import titleCase from "title-case";
import Waypoint from "react-waypoint";
import Button from "../components/Button";
import Alert, { handleApiError } from "../components/Alert";
import LoginGate from "../components/LoginGate";
import EditablePhotos from "../components/EditablePhotos";
import Page from "../components/Page";
import EditSocialLinks from "../components/EditSocialLinks";
import VerifyNetworksSection from "../components/VerifyNetworksSection";
import Subheader from "../components/Subheader";
import Icon from "../components/Icon";
import TextInput from "../components/TextInput";
import Switch from "../components/Switch";
import { getMobileDetect } from "../lib/Mobile";
import withLogin from "../lib/withLogin";
import SharableSocialLink from "../components/SharableSocialLink";
import CopyURLForm from "../components/CopyURLForm";
import {
  buildEditProfileURL,
  buildProfileURL,
  buildProfileShareURL,
  buildMobileEditPageURL
} from "../lib/routeHelpers";
import ProfileProgress, {
  PROFILE_SELECTORS
} from "../components/ProfileProgress";
import Sticky from "react-stickynode";
import { logEvent } from "../lib/analytics";

const SECTION_ORDERING = [
  "introduction",
  "background",
  "looking-for",
  "not-looking-for"
];

const PRODUCTION_SECTION_EXAMPLES = {
  introduction: "amanda",
  background: "ry",
  "looking-for": "jess",
  "not-looking-for": "rodrigo"
};

const DEVELOPMENT_SECTION_EXAMPLES = {
  introduction: "lucy",
  background: "jarred",
  "looking-for": "lucy",
  "not-looking-for": "jarred"
};

const SECTION_EXAMPLES =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_SECTION_EXAMPLES
    : DEVELOPMENT_SECTION_EXAMPLES;

const SECTION_LABELS = {
  introduction: "Introduction",
  background: "Background",
  "looking-for": "Looking for",
  "not-looking-for": "Not looking for"
};

const SECTION_PLACEHOLDERS = {
  introduction:
    "Optional: Give a short summary of yourself (likes, dislikes, hobbies, etc)",
  background:
    "Optional: Give some background about yourself, in more detail than your introduction. Where are you from? How did you get to where you are now?",
  "looking-for":
    "Optional: Tell your applicants what you're looking for (e.g. a girl/boyfriend, or just a date for an event)",
  "not-looking-for":
    "Optional: Tell your applicants what you're NOT looking for (e.g. no hookups)"
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

const getProfileFromProps = props => {
  const profile = props.profile || {};
  const {
    tagline,
    photos = [],
    socialLinks = {},
    recommendedContactMethod = "phone",
    phone = "",
    sections: profileSections = {},
    visible
  } = profile;

  const sections = _.fromPairs(
    SECTION_ORDERING.map(key => [key, (profileSections || {})[key] || ""])
  );

  return {
    name: profile.name || "",
    tagline: tagline || "",
    photos: photos || [],
    phone: phone || "",
    sections,
    visible: !!visible,
    socialLinks: socialLinks || {},
    recommendedContactMethod: recommendedContactMethod || "phone"
  };
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

class EditProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...getProfileFromProps(props),
      currentPhotoIndex: null,
      isHeaderSticky: false,
      isSavingProfile: false,
      externalAuthentications: null
    };
  }

  componentWillReceiveProps(props) {
    if (props.profile !== this.props.profile) {
      this.setState(getProfileFromProps(props));
    }
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
      visible,
      recommendedContactMethod
    } = this.state;

    if (isSavingProfile) {
      return;
    }

    this.setState({
      isSavingProfile: true
    });

    const params = {
      visible: visible,
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
    };

    _.each(params, (value, key) => {
      if (value === undefined) {
        delete params[key];
      }
    });

    return updateProfile({
      id: this.props.profile.id,
      ...params
    })
      .then(response => {
        this.props.updateEntities(response.body);
        if (response && showAlert) {
          Alert.success("Saved.");
        }

        logEvent("Edit Profile");

        return response.body;
      })
      .catch(error => {
        handleApiError(error);

        return false;
      })
      .finally(response => {
        this.setState({
          isSavingProfile: false,
          visible: this.props.profile.visible
        });

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

  toggleVisible = () => {
    this.setState({ visible: !this.state.visible }, () => {
      this.handleSaveProfile();
      if (this.state.visible) {
        logEvent("Show Profile");
      } else {
        logEvent("Hide Profile");
      }
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
  setTagline = tagline => {
    this.setState({ tagline });
  };
  setPhotoAtIndex = index => url => {
    const photos = this.state.photos.slice();
    photos.splice(index, 1, url);

    this.setState({ photos: photos });
  };

  render() {
    const { profile, isMobile } = this.props;
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
        renderOutside={() => (
          <ProfileProgress
            isMobile={isMobile}
            profile={{
              name,
              tagline,
              socialLinks,
              photos,
              sections: this.state.sections,
              recommendedContactMethod,
              phone
            }}
          />
        )}
        headerProps={{
          isSticky: false,
          renderSubheader: () => (
            <div id="StickySubheader">
              <Subheader bottom={false} center>
                <div className="Subheader">
                  <div className="Subheader-text Subheader-text--desktop">
                    <Text align="right" wrap={false} weight="bold" size="14px">
                      To get more applications, link to your page on
                      Tinder/Instagram
                    </Text>
                  </div>
                  <div className="Subheader-text Subheader-text--mobile">
                    <Text align="right" wrap={false} weight="bold" size="14px">
                      Share
                    </Text>
                  </div>
                  <div className="Subheader-urlWrapper">
                    <CopyURLForm
                      hideInputOnMobile
                      url={buildProfileShareURL(profile.id)}
                    />
                  </div>
                  <div className="Subheader-buttons">
                    <SharableSocialLink
                      provider="twitter"
                      width="36px"
                      height="36px"
                      url={buildProfileShareURL(profile.id)}
                    />

                    <SharableSocialLink
                      provider="facebook"
                      width="36px"
                      height="36px"
                      url={buildProfileShareURL(profile.id)}
                    />
                  </div>
                </div>
              </Subheader>
            </div>
          )
        }}
      >
        <Head
          mobileURL={buildMobileEditPageURL()}
          title="Edit Page | Apply to Date"
        />
        <section
          className={classNames(
            "Section Section--center Section--title",
            PROFILE_SELECTORS.name
          )}
        >
          <Text type="ProfilePageTitle">
            <div className="name-intro">👋 Hi, I'm: </div>
            <EditableText
              value={name}
              onChange={this.setName}
              placeholder="Your Name"
              type="ProfilePageTitle"
              width={getWidthForText(name || "Your Name", !name)}
            />
          </Text>
        </section>

        <section
          className={classNames(
            "Section Section-row--Tagline",
            PROFILE_SELECTORS.tagline
          )}
        >
          <TextArea
            placeholder="Enter a one-liner about yourself"
            type="Tagline"
            value={tagline}
            onChange={this.setTagline}
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

          <div
            className={classNames("Verify", PROFILE_SELECTORS.contactMethod)}
          >
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

        <section
          className={classNames("Section", PROFILE_SELECTORS.socialLinks)}
        >
          <div className="TextGroup">
            <Text type="title">Public social media</Text>
            <Text wrap>
              Public profiles you want displayed on your page.{" "}
              <strong>Anyone can see these:</strong>
            </Text>
          </div>
          <EditSocialLinks
            socialLinks={socialLinks}
            save={this.handleSaveProfile}
            setSocialLinks={socialLinks => this.setState({ socialLinks })}
          />
        </section>

        <section
          className={classNames(
            "Section Section--photos",
            PROFILE_SELECTORS.photos
          )}
        >
          <Text type="label">Share some pics</Text>
          <EditablePhotos
            photos={photos}
            size="100%"
            remoteSize={"380px"}
            setPhotoAtIndex={this.setPhotoAtIndex}
          />
        </section>
        <section className="Section Section--bio">
          {this.paragraphs().map(paragraph => {
            return (
              <div
                key={paragraph.key}
                className={classNames(
                  "Section-row Section-row--bio",
                  PROFILE_SELECTORS[paragraph.key]
                )}
              >
                <div>
                  <Text className="Section-title" type="title">
                    {paragraph.title}
                  </Text>
                  <a
                    className="example-link"
                    href={`${buildProfileURL(
                      SECTION_EXAMPLES[paragraph.key]
                    )}#${paragraph.key}`}
                    target="_blank"
                  >
                    See an example
                  </a>
                </div>
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

        <Subheader padding="large" bottom spaceBetween>
          <Switch checked={profile.visible} onChange={this.toggleVisible}>
            {profile.visible ? "Page is live" : "Page is not live"}
          </Switch>

          <div className="Footer--actions">
            <div className="Footer--Input">
              <TextInput
                rounded
                fake
                disabled
                readOnly
                type="url"
                value={profile.url}
              >
                <div className="OpenButton">
                  <Button
                    size="xsmall"
                    href={profile.url}
                    color="green"
                    target="_blank"
                    fill
                  >
                    <Icon type="caret-right" size="10px" />
                  </Button>
                </div>
              </TextInput>
            </div>
            <Button
              componentType="div"
              color="green"
              pending={this.state.isSavingProfile}
              onClick={this.handleSaveProfile}
            >
              Save
            </Button>
          </div>
        </Subheader>

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

          .Section-title {
            margin-bottom: 14px;
          }

          .Section-tagline {
            font-size: 18px;
          }

          .Section-row--bio {
            display: grid;
            grid-row-gap: 1rem;
            width: 100%;
          }

          .Section--center {
            text-align: center;
          }

          .Verify {
            margin-left: auto;
            margin-right: auto;
          }

          .Footer--actions {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 14px;
            width: max-content;
          }

          .OpenButton {
            margin-right: 8px;
            margin-top: auto;
            margin-bottom: auto;
          }

          .name-intro {
            margin-right: 40px;
            margin-bottom: 24px;
          }

          .example-link {
            color: #333;
            text-decoration: underline;
            float: right;
            margin-top: 20px;
          }

          .Section-row--Tagline {
            margin-top: 2rem;
          }

          .Subheader-buttons {
            display: grid;
            grid-auto-flow: column dense;
            grid-column-gap: 14px;
            grid-template-columns: 38px 38px;
          }

          .Subheader-urlWrapper {
            display: grid;
            width: 100%;
          }

          .Subheader {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 14px;
            align-items: center;
            width: 100%;
            justify-content: center;
            grid-template-columns: 1fr 1fr 1fr;
          }

          .Subheader-text {
            text-align: right;
          }

          .Subheader-text--mobile {
            display: none;
          }

          @media (max-width: 900px) {
            .Subheader-text--mobile {
              display: flex;
            }

            .Subheader-text--desktop {
              display: none;
            }
          }

          @media (max-width: 600px) {
            .Footer--Input {
              display: none;
            }
          }
        `}</style>
      </Page>
    );
  }
}

class ProfileGate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingProfile: true
    };
  }
  async componentDidMount() {
    getProfile(this.props.currentUser.username).then(response => {
      this.props.updateEntities(response.body);

      this.setState({
        isLoadingProfile: false
      });

      if (
        _.get(this.props.url, "query.id") !== this.props.currentUser.username
      ) {
        Router.replaceRoute(
          buildEditProfileURL(this.props.currentUser.username),
          buildEditProfileURL(this.props.currentUser.username),
          {
            shallow: true
          }
        );
      }
    });
  }

  render() {
    if (!this.props.profile || this.state.isLoadingProfile) {
      return <Page isLoading />;
    } else {
      return <EditProfile {...this.props} />;
    }
  }
}

const ProfileWithStore = withRedux(
  initStore,
  (state, props) => {
    const currentUser = state.user[state.currentUserId];

    if (currentUser) {
      return {
        profile: state.profile[currentUser.username]
      };
    } else {
      return {
        profile: null
      };
    }
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch),
  null,
  {
    pure: false
  }
)(
  withLogin(
    LoginGate(ProfileGate, {
      loginRequired: true
    })
  )
);

export default ProfileWithStore;
