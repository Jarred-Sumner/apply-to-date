import Link from "next/link";
import Head from "../components/head";
import { Router } from "../routes";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import {
  getProfile,
  getCurrentUser,
  updateProfile,
  getSavedApplication,
  updateApplication
} from "../api";
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
import FormField, { SexFormField, TOSFormField } from "../components/FormField";
import EditSocialLinks from "../components/EditSocialLinks";
import VerifyNetworksSection from "../components/VerifyNetworksSection";
import qs from "qs";
import Icon from "../components/Icon";
import MessageBar from "../components/MessageBar";

export const SECTION_ORDERING = ["introduction", "why"];

export const SECTION_LABELS = {
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
    const profileResponse = await getProfile(query.id);
    store.dispatch(updateEntities([_.get(profileResponse, "body.data")]));

    const applicationResponse = await getSavedApplication(query.applicationId);
    store.dispatch(updateEntities(applicationResponse.body));
  }

  constructor(props) {
    super(props);

    const { application, profile } = props;

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false,
      isSavingProfile: false,
      name: _.get(application, "name", ""),
      recommendedContactMethod:
        _.get(application, "recommendedContactMethod") ||
        _.get(profile, "recommendedContactMethod") ||
        "phone",
      phone: _.get(application, "phone", ""),
      email: _.get(application, "email", props.url.query.email || ""),
      socialLinks: _.get(application, "socialLinks", {}),
      sex: _.get(application, "sex", ""),
      externalAuthentications: _.get(application, "externalAuthentications", [])
    };
  }

  saveApplication = async (status = "pending") => {
    const {
      isSavingProfile,
      email,
      name,
      photos,
      tagline,
      socialLinks,
      externalAuthentications,
      recommendedContactMethod,
      sex,
      sections,
      phone
    } = this.state;
    const { id: profileId } = this.props.profile;

    if (isSavingProfile) {
      return;
    }

    this.setState({
      isSavingProfile: true
    });

    return updateApplication({
      profileId,
      name,
      tagline,
      email,
      phone,
      socialLinks,
      sex,
      recommendedContactMethod,
      sections,
      externalAuthentications: externalAuthentications.map(({ id }) => id),
      photos,
      status
    })
      .then(async response => {
        return response.body;
      })
      .catch(error => {
        console.error(error);
        handleApiError(error);
        return null;
      })
      .finally(response => {
        this.setState({ isSavingProfile: false });
        return response;
      });
  };

  submitApplication = event => {
    event.preventDefault();

    if (!this.state.termsOfService) {
      Alert.error("To continue, you must agree to the terms of service");
      return;
    }

    this.saveApplication("submitted").then(response => {
      if (response) {
        return Router.push(`/a/${this.props.application.id}`);
      } else {
        return;
      }
    });
  };

  setRecommendedContactMethod = recommendedContactMethod =>
    this.setState({ recommendedContactMethod });
  setPhone = phone => this.setState({ phone });
  setEmail = email => this.setState({ email });
  setSex = sex => this.setState({ sex });
  setName = evt => this.setState({ name: evt.target.value });
  setExternalAuthentications = externalAuthentications =>
    this.setState({ externalAuthentications });

  render() {
    const { profile } = this.props;
    const {
      name,
      photos,
      socialLinks,
      email,
      externalAuthentications,
      recommendedContactMethod,
      phone,
      sex
    } = this.state;

    return (
      <Page
        size="small"
        renderMessage={() => (
          <MessageBar>
            <Text size="14px" color="white" lineHeight="19px">
              Your application to{" "}
              <Link href={`/${profile.id}`}>
                <a>{profile.name}</a>
              </Link>
            </Text>
          </MessageBar>
        )}
      >
        <Head
          url={process.env.DOMAIN + this.props.url.asPath}
          title={
            profile && `Your application to date ${profile.name} | applytodate`
          }
          favicon={profile && _.sample(profile.photos)}
          ogImage={profile && _.first(profile.photos)}
        />
        <form onSubmit={this.submitApplication}>
          <div className="Section-row">
            <Text type="ProfilePageTitle">
              👋 Hi I'm{" "}
              <EditableText
                value={name}
                onChange={this.setName}
                placeholder="Your Name"
                type="ProfilePageTitle"
                width={getWidthForText(name || "Your Name", !name)}
              />
            </Text>
          </div>

          <div className="Section-row Section-row--email">
            <Text type="subtitle">You can reach me at:</Text>

            <FormField
              name="email"
              type="email"
              required
              icon={<Icon type="email" size="20px" color="#B9BED1" />}
              value={email}
              onChange={this.setEmail}
              placeholder="e.g. example@example.com"
            />

            <Text weight="semiBold" size="14px" color="#820B0B">
              You’ll hear back via email, please make sure it's correct.
            </Text>

            <VerifyNetworksSection
              recommendedContactMethod={recommendedContactMethod}
              setRecommendedContactMethod={this.setRecommendedContactMethod}
              phone={phone}
              setPhone={this.setPhone}
              save={this.saveApplication}
              externalAuthentications={externalAuthentications}
              whitelist={["twitter", "facebook", "instagram", "phone"]}
              setExternalAuthentications={this.setExternalAuthentications}
            />
          </div>

          <div className="Section-row">
            <EditSocialLinks
              socialLinks={socialLinks}
              blacklist={externalAuthentications.map(
                ({ provider }) => provider
              )}
              setSocialLinks={socialLinks => this.setState({ socialLinks })}
            />
          </div>

          <div className="Section-row">
            <SexFormField value={sex} onChange={this.setSex} />
          </div>

          <TOSFormField
            checked={this.state.termsOfService || false}
            onChange={() =>
              this.setState({
                termsOfService: !this.state.termsOfService
              })
            }
          />

          <Button>
            <Icon type="heart" size="14px" />&nbsp; Ask {profile.name} out
          </Button>
        </form>

        <style jsx>{`
          form {
            display: grid;
            margin-top: 2rem;
            grid-auto-flow: row dense;
            grid-row-gap: 2rem;
            width: 100%;
            text-align: center;
          }

          .Section-row {
            width: 100%;
          }

          .Section-row--email {
            display: grid;
            grid-row-gap: 1rem;
            margin-left: auto;
            margin-right: auto;
          }
        `}</style>
      </Page>
    );
  }
}

const CreateApplicationWithStore = withRedux(
  initStore,
  (state, props) => {
    const { id, applicationId } = _.get(props, "url.query", {});

    return {
      profile: state.profile[id],
      application: state.application[applicationId]
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(CreateApplication));

export default CreateApplicationWithStore;
