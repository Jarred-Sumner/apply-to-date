import classNames from "classnames";
import _ from "lodash";
import withRedux from "next-redux-wrapper";
import { updateProfile } from "../api";
import Alert, { handleApiError } from "../components/Alert";
import Button from "../components/Button";
import EditablePhotos from "../components/EditablePhotos";
import EditableText from "../components/EditableText";
import EditSocialLinks from "../components/EditSocialLinks";
import Head from "../components/head";
import LoginGate from "../components/LoginGate";
import Page from "../components/Page";
import { PROFILE_SELECTORS } from "../components/ProfileProgress";
import Subheader from "../components/Subheader";
import Text from "../components/Text";
import { logEvent } from "../lib/analytics";
import { buildMobileEditPageURL } from "../lib/routeHelpers";
import { initStore } from "../redux/store";
import Tag from "../components/Tag";
import { COLORS } from "../helpers/styles";
import { UsernameFormField } from "../components/FormField";

const getWidthForText = (text, isPlaceholder) => {
  if (isPlaceholder) {
    return `${Math.max((text.length + 1) * 21, 22)}px`;
  } else {
    return `${Math.max(text.length * 20.5, 22)}px`;
  }
};

class CreateFriendProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      username: "",
      socialLinks: {},
      photos: [],
      currentPhotoIndex: null,
      isHeaderSticky: false,
      isSavingProfile: false,
      externalAuthentications: null
    };
  }

  handleSaveProfile = async (showAlert = true) => {
    const { isSavingProfile, name, socialLinks, photos, visible } = this.state;

    if (isSavingProfile) {
      return;
    }

    this.setState({
      isSavingProfile: true
    });

    const params = {
      visible: visible,
      name,
      photos,
      social_links: socialLinks
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

  setCurrentPhoto = url => {
    this.setState({
      currentPhotoIndex: this.props.profile.photos.indexOf(url)
    });
  };

  setUsername = username => this.setState({ username });

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

  setName = evt => this.setState({ name: evt.target.value });
  setPhotoAtIndex = index => url => {
    const photos = this.state.photos.slice();
    photos.splice(index, 1, url);

    this.setState({ photos: photos });
  };

  render() {
    const { name, photos, socialLinks, username } = this.state;

    return (
      <Page headerProps={{ isSticky: false }}>
        <Head
          mobileURL={buildMobileEditPageURL()}
          title="Create a friend's profile | Apply to Date"
        />
        <section
          className={classNames("Section Section--center Section--title")}
        >
          <div className="TextGroup">
            <Text type="title">What's your friend's name?</Text>

            <Text type="ProfilePageTitle">
              <EditableText
                value={name}
                onChange={this.setName}
                placeholder="Friend's name"
                type="ProfilePageTitle"
                width={getWidthForText(name || "Friend's Name", !name)}
              />
            </Text>
          </div>
        </section>

        <section
          className={classNames("Section", PROFILE_SELECTORS.socialLinks)}
        >
          <div className="TextGroup">
            <Text type="title">Social networks</Text>
            <Text wrap>Public profiles to show on their page.</Text>
          </div>
          <EditSocialLinks
            socialLinks={socialLinks}
            setSocialLinks={socialLinks => this.setState({ socialLinks })}
          />
        </section>

        <section
          className={classNames(
            "Section Section--photos",
            PROFILE_SELECTORS.photos
          )}
        >
          <Text type="label">Upload friend's pics &mdash; keep it PG-13.</Text>
          <EditablePhotos
            photos={photos}
            size="100%"
            remoteSize={"380px"}
            setPhotoAtIndex={this.setPhotoAtIndex}
          />
        </section>

        <section className="Section Section--username Section--center">
          <UsernameFormField value={username} onChange={this.setUsername} />
        </section>

        <section className="Section Section--center">
          <Button
            color="blue"
            maxWidth="200px"
            size="large"
            onClick={this.handleCreate}
          >
            Next
          </Button>
        </section>

        <style jsx>{`
          .Section {
            margin-top: 4rem;
            display: grid;
            grid-row-gap: 2rem;
          }

          .Section--username {
            max-width: 400px;
          }

          .Section--center {
            justify-content: center;
            align-self: center;
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

export default withRedux(initStore)(
  LoginGate(CreateFriendProfile, { loginRequired: true })
);
