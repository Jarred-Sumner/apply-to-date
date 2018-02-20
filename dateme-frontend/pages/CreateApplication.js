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
import withLogin from "../lib/withLogin";

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

const buildExternalAuthentications = ({ application = {}, url }) => {
  return [
    ..._.get(application, "externalAuthentications", []).map(({ id }) => id),
    ..._.values(
      _.pick(url.query, ["twitter", "facebook", "instagram", "linkedin"])
    )
  ];
};

class CreateApplication extends React.Component {
  static async getInitialProps({ query, store, req, isServer }) {
    const profileResponse = await getProfile(query.id);
    store.dispatch(updateEntities(profileResponse.body));

    if (query.applicationId) {
      const applicationResponse = await getSavedApplication(
        query.applicationId
      );
      store.dispatch(updateEntities(applicationResponse.body));
    }
  }

  getDefaultValues = (props, state) => {
    return _.defaultsDeep(
      {
        name: _.get(state, "name") || undefined,
        phone: _.get(state, "phone") || undefined,
        email: _.get(state, "email") || undefined,
        socialLinks: _.get(state, "socialLinks") || undefined,
        sex: _.get(state, "sex") || undefined
      },
      {
        name: _.get(props, "url.query.name", undefined),
        phone: _.get(props, "url.query.phone", undefined),
        email: _.get(props, "url.query.email", undefined),
        socialLinks: _.pick(props.url.query, [
          "twitter",
          "facebook",
          "instagram",
          "linkedin"
        ]),
        sex: _.get(props, "url.query.sex", undefined)
      },
      {
        name: _.get(props, "application.name", undefined),
        phone: _.get(props, "application.phone", undefined),
        email: _.get(props, "application.email", undefined),
        sections: _.get(props, "application.sections", undefined),
        sex: _.get(props, "application.sex", undefined)
      },
      {
        name: _.get(props, "currentUser.profile.name", undefined),
        phone: _.get(props, "currentUser.profile.phone", undefined),
        email: _.get(props, "currentUser.email", undefined),
        sections: _.get(props, "currentUser.profile.sections", undefined),
        sex: _.get(props, "currentUser.sex", undefined)
      },
      {
        name: "",
        email: "",
        phone: "",
        sections: {},
        sex: ""
      }
    );
  };

  constructor(props) {
    super(props);

    const { profile } = props;

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false,
      isSavingProfile: false,
      ...this.getDefaultValues(props, {}),
      externalAuthentications: buildExternalAuthentications({
        application: _.get(props, "application"),
        url: _.get(props, "url")
      })
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.currentUser && this.props.currentUser) {
      this.setState(this.getDefaultValues(this.props, this.state));
    }
  }

  saveApplication = async (status = "pending") => {
    const {
      isSavingProfile,
      email,
      name,
      photos,
      externalAuthentications,
      sex,
      sections,
      socialLinks,
      phone
    } = this.state;
    const { id: profileId } = this.props.profile;

    if (_.isEmpty(externalAuthentications)) {
      Alert.error("Please include an online profile");
      return;
    }

    if (isSavingProfile) {
      return;
    }

    this.setState({
      isSavingProfile: true
    });

    return updateApplication({
      profileId,
      name,
      email,
      phone,
      sections,
      sex,
      status,
      externalAuthentications
    })
      .then(async response => {
        if (response.body) {
          const urlParams = {
            ..._.get(this.props, "url.query"),
            applicationId: _.get(response, "body.data.id")
          };

          return Router.replaceRoute(
            `${this.props.url.asPath.split("?")[0]}?${qs.stringify(urlParams)}`
          ).then(() => response.body);
        }

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

    if (!this.state.termsOfService && !this.props.currentUser) {
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

  saveToQueryString = () => {
    const urlParams = {
      ..._.get(this.props, "url.query"),
      name: this.state.name,
      phone: this.state.phone,
      email: this.state.email,
      sex: this.state.sex
    };

    return Router.replaceRoute(
      `${this.props.url.asPath.split("?")[0]}?${qs.stringify(urlParams)}`,
      `${this.props.url.asPath.split("?")[0]}?${qs.stringify(urlParams)}`,
      {
        shallow: true
      }
    );
  };

  setRecommendedContactMethod = recommendedContactMethod =>
    this.setState({ recommendedContactMethod });
  setPhone = phone => this.setState({ phone });
  setEmail = email => this.setState({ email });
  setSex = sex => this.setState({ sex });
  setName = name => this.setState({ name });
  setExternalAuthentications = externalAuthentications =>
    this.setState({ externalAuthentications });

  render() {
    const { profile, currentUser } = this.props;
    const {
      name,
      photos,
      socialLinks,
      email,
      externalAuthentications,
      recommendedContactMethod,
      phone,
      sex,
      isSavingProfile
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
            profile &&
            `Your application to date ${profile.name} | Apply to Date`
          }
          favicon={profile && _.first(profile.photos)}
          ogImage={profile && _.first(profile.photos)}
          disableGoogle
        />
        <form onSubmit={this.submitApplication}>
          <div className="Section-row">
            <Text type="ProfilePageTitle">
              👋 Hi {profile ? profile.name + "," : ""} I'm:
            </Text>
          </div>

          <div className="Section-row">
            <FormField
              name="name"
              type="text"
              label="Name"
              required
              icon={<Icon type="user" size="20px" color="#B9BED1" />}
              value={name}
              onChange={this.setName}
              placeholder="Your name"
            />
          </div>

          <div className="Section-row">
            <FormField
              name="email"
              type="email"
              label="Email"
              required
              icon={<Icon type="email" size="20px" color="#B9BED1" />}
              value={email}
              onChange={this.setEmail}
              placeholder="e.g. example@example.com"
            />

            <div className="Section-subrow">
              <Text type="validation" align="center">
                You’ll receive updates via email, please make sure this is
                correct
              </Text>
            </div>
          </div>

          <div className="Section-row Section-row--phone">
            <FormField
              name="phone"
              label="SMS number (optional but recommended)"
              type="tel"
              required={false}
              icon={<Icon type="phone" size="20px" color="#B9BED1" />}
              value={phone}
              onChange={this.setPhone}
              placeholder="e.g. 925200055555"
            />
          </div>
          <div className="Section-subrow">
            <Text type="subtitle">My online profiles are:</Text>
            <Text type="validation" align="center">
              {!_.isEmpty(
                _.values(this.state.socialLinks).filter(_.identity)
              ) && (
                <React.Fragment>
                  <Icon inline type="check" color="#00E2AA" size="12px" />&nbsp;
                </React.Fragment>
              )}
              At least one is required
            </Text>
          </div>
          <div className="Section-row">
            <EditSocialLinks
              socialLinks={socialLinks}
              save={this.saveToQueryString}
              whitelist={["twitter", "facebook", "instagram", "linkedin"]}
              allowOAuth
            />
          </div>

          <div className="Section-row">
            <SexFormField value={sex} onChange={this.setSex} />
          </div>

          {!currentUser && (
            <TOSFormField
              checked={this.state.termsOfService || false}
              onChange={() =>
                this.setState({
                  termsOfService: !this.state.termsOfService
                })
              }
            />
          )}

          <Button pending={isSavingProfile}>
            <Icon type="heart" size="14px" />&nbsp; Ask {profile.name} out
          </Button>
        </form>

        <style jsx>{`
          form {
            display: grid;
            margin-top: 2rem;
            grid-auto-flow: row dense;
            grid-row-gap: 28px;
            width: 100%;
            text-align: center;
          }

          .Section-row {
            width: 100%;
          }

          .Section-subrow {
            grid-auto-flow: row dense;
            grid-row-gap: 14px;
            display: grid;
            margin-top: 7px;
            margin-bottom: 7px;
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
      profile: state.profile[decodeURI(id)],
      application: state.application[applicationId]
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(CreateApplication));

export default CreateApplicationWithStore;
