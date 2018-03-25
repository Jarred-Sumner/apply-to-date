import { Link } from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import {
  updateEntities,
  setCurrentUser,
  initStore,
  normalizeApiResponse,
  profileSelector,
  dateEventSelector,
  dateEventBySlug
} from "../redux/store";
import {
  getProfile,
  getCurrentUser,
  withCookies,
  incrementProfileViewCount,
  getDateEventBySlug,
  getDateEvent
} from "../api";
import { bindActionCreators } from "redux";
import Header from "../components/Header";
import LoginGate from "../components/LoginGate";
import Text from "../components/Text";
import Icon from "../components/Icon";
import InlineApply from "../components/profile/InlineApply";
import _ from "lodash";
import titleCase from "title-case";
import Waypoint from "react-waypoint";
import Button from "../components/Button";
import AskProfileOutButton from "../components/AskProfileOutButton";
import Thumbnail from "../components/Thumbnail";
import PageFooter from "../components/PageFooter";
import Page from "../components/Page";
import SocialLinkList from "../components/SocialLinkList";
import MessageBar from "../components/MessageBar";
import PhotoGroup from "../components/PhotoGroup";
import Typed from "react-typed";
import withLogin from "../lib/withLogin";
import moment from "moment";
import { Router } from "../routes";
import {
  buildProfileURL,
  buildEditProfileURL,
  buildMobileViewProfileURL
} from "../lib/routeHelpers";
import { getMobileDetect } from "../lib/Mobile";
import Subheader from "../components/Subheader";
import { animateScroll } from "react-scroll";
import Linkify from "react-linkify";
import ProfileComponent from "../components/Profile";
import { logEvent } from "../lib/analytics";
import { hasMobileAppInstalled } from "../lib/applyMobileCookie";
import ViewDateEvent from "../components/DateEvent/ViewDateEvent";
import {
  LABELS_BY_CATEGORY,
  CATEGORIES,
  labelWithPrefix
} from "../helpers/dateEvent";

const formatPageTitle = ({ profile, dateEvent }) => {
  return `${_.capitalize(LABELS_BY_CATEGORY[dateEvent.category])} with ${
    profile.name
  } on ${moment(dateEvent.occursOnDay).format("dddd")}`;
};

const formatPageDescription = ({ profile, dateEvent }) => {
  if (dateEvent.summary) {
    return dateEvent.summary;
  } else {
    if (
      [
        CATEGORIES.dine,
        CATEGORIES.lunch,
        CATEGORIES.coffee,
        CATEGORIES.fitness
      ].includes(dateEvent.category)
    ) {
      return `Apply to ${labelWithPrefix(dateEvent.category)} with ${
        profile.name
      } on ${moment(dateEvent.occursOnDay).format("dddd")}`;
    } else {
      return `Apply to go with ${profile.name} to ${labelWithPrefix(
        dateEvent.category
      )} on ${moment(dateEvent.occursOnDay).format("dddd")}`;
    }
  }
};

class Profile extends React.Component {
  static async getInitialProps({ query, store, req, res, isServer }) {
    const response = await getDateEvent(query.id);

    const normalizedResponse = normalizeApiResponse(response.body);
    store.dispatch(updateEntities(response.body));

    const dateEvent = _.first(_.values(normalizedResponse.date_event));
    const profile = _.first(_.values(normalizedResponse.profile));
    const dateEventId = (dateEvent || {}).id;
    const profileId = (profile || {}).id;

    if (dateEvent) {
      if (isServer) {
        res.writeHead(302, {
          Location: dateEvent.url
        });
      } else {
        Router.replaceRoute(dateEvent.url);
      }
    }

    return { profileId, dateEventId };
  }

  constructor(props) {
    super(props);

    this.state = {
      currentPhotoIndex: null,
      isHeaderSticky: false
    };
  }

  async componentDidMount() {
    let { profile = null, dateEvent = null, dateEventId } = this.props;
    if (!dateEvent) {
      const response = await getDateEvent(dateEventId);

      const normalizedResponse = normalizeApiResponse(response.body);
      this.props.updateEntities(response.body);

      dateEvent = _.first(_.values(normalizedResponse.date_event));
      profile = _.first(_.values(normalizedResponse.profile));
    }

    // Redirect to correct route
    if (profile && dateEvent) {
      Router.replaceRoute(`/${profile.id}/${dateEvent.slug}`);
    }
  }

  render() {
    const { profile, currentUser, dateEvent, isMobile } = this.props;
    return <Page isLoading />;
  }
}

const ProfileWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      profile: profileSelector(state)[props.profileId],
      dateEvent: dateEventSelector(props.dateEventId)
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(Profile));

export default ProfileWithStore;
