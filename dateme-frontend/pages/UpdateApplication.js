import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import { Router } from "../routes";
import NextRouter from "next/router";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import {
  updateExistingApplication,
  saveApplication,
  getSavedApplication
} from "../api";
import { bindActionCreators } from "redux";
import Header from "../components/Header";
import Text from "../components/Text";
import EditableText from "../components/EditableText";
import TextArea from "../components/TextArea";
import _ from "lodash";
import titleCase from "title-case";
import Button from "../components/Button";
import Alert, { handleApiError } from "../components/Alert";
import LoginGate from "../components/LoginGate";
import Page from "../components/Page";
import FormField from "../components/FormField";
import EditSocialLinks from "../components/EditSocialLinks";
import EditablePhotos from "../components/EditablePhotos";
import VerifyNetworksSection from "../components/VerifyNetworksSection";
import qs from "qs";
import Icon from "../components/Icon";

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

class UpdateApplication extends React.Component {
  static async getInitialProps({ query, store, req, isServer }) {
    try {
      const response = await getSavedApplication(query.id);

      const profile = _.get(response, "body.data.profile");
      const entities = {
        ...response,
        data: [response.body.data, profile]
      };

      store.dispatch(updateEntities(entities));

      return {
        applicationId: query.id,
        profileId: profile.id
      };
    } catch (exception) {
      console.error(exception);
    }
  }

  constructor(props) {
    super(props);

    const { application } = props;

    this.state = {
      name: _.get(application, "name", ""),
      photos: _.get(application, "photos", []),
      sections: _.get(application, "sections", {
        introduction: "",
        why: ""
      })
    };
  }

  handleUpdateApplication = async () => {
    const { isSaving, email, photos, socialLinks, sections } = this.state;
    const { id } = this.props.application;

    if (isSaving) {
      return;
    }

    this.setState({
      isSaving: true
    });

    return updateExistingApplication({
      email,
      photos,
      id,
      socialLinks,
      sections
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
        this.setState({ isSaving: false });
        return response;
      });
  };

  setEmail = email => this.setState({ email });

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
  setPhotoAtIndex = index => url => {
    const photos = this.state.photos.slice();
    photos.splice(index, 1, url);

    this.setState({ photos: photos });
  };

  render() {
    const { profile } = this.props;
    const { photos, socialLinks, email, externalAuthentications } = this.state;

    return (
      <Page>
        <Head />

        <section className="Section Section--photos">
          <Text type="label">Share some pics</Text>
          <EditablePhotos
            photos={photos}
            setPhotoAtIndex={this.setPhotoAtIndex}
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

        <section className="Section Section--profiles">
          <Text type="title" align="center">
            Social profiles
          </Text>
          <EditSocialLinks
            socialLinks={socialLinks}
            blacklist={this.props.application.externalAuthentications.map(
              ({ provider }) => provider
            )}
            setSocialLinks={socialLinks => this.setState({ socialLinks })}
          />
        </section>

        <section className="Section Section--apply">
          <Button
            pending={this.state.isSaving}
            componentType="div"
            onClick={this.handleUpdateApplication}
          >
            Update application
          </Button>
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

          .Section-row--email {
            display: grid;
            grid-row-gap: 1rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
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

const UpdateApplicationWithStore = withRedux(
  initStore,
  (state, props) => {
    const { profileId, applicationId } = props;
    console.log(state);
    return {
      profile: state.profile[profileId],
      application: state.application[applicationId]
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(UpdateApplication));

export default UpdateApplicationWithStore;
