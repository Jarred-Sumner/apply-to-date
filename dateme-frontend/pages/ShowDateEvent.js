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
  dateEventBySlug,
  dateEventApplicationsByDateEventID
} from "../redux/store";
import {
  getProfile,
  getCurrentUser,
  withCookies,
  incrementProfileViewCount,
  getDateEventBySlug,
  getAppliedDateEvents
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
import cookies from "next-cookies";

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
  static async getInitialProps(ctx) {
    const { query, store, req, isServer } = ctx;
    const response = await getDateEventBySlug({
      profileId: decodeURI(query.profileId),
      slug: decodeURI(query.slug)
    });
    store.dispatch(updateEntities(response.body));
    const { currentUserId } = cookies(ctx);

    const normalizedResponse = normalizeApiResponse(response.body);

    const dateEventId = (_.first(_.values(normalizedResponse.date_event)) || {})
      .id;
    const profileId = (_.first(_.values(normalizedResponse.profile)) || {}).id;

    if (!isServer && currentUserId) {
      await getAppliedDateEvents([dateEventId]).then(response =>
        store.dispatch(updateEntities(response.body))
      );
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
    let { profile = null, dateEvent = null } = this.props;
    if (!profile) {
      const response = await getDateEventBySlug({
        profileId: decodeURI(this.props.url.query.profileId),
        slug: decodeURI(this.props.url.query.slug)
      });

      const normalizedResponse = normalizeApiResponse(response.body);
      this.props.updateEntities(response.body);

      dateEvent = _.first(_.values(normalizedResponse.date_event));
      profile = _.first(_.values(normalizedResponse.profile));
    }

    // Update old URL when slug changes
    if (
      profile &&
      dateEvent &&
      decodeURI(this.props.url.query.slug) !== dateEvent.slug
    ) {
      Router.replaceRoute(
        `/${profile.id}/${dateEvent.slug}`,
        `/${profile.id}/${dateEvent.slug}`,
        {
          shallow: true
        }
      );
    } else if (dateEvent) {
      getAppliedDateEvents([dateEvent.id]).then(response =>
        this.props.updateEntities(response.body)
      );
    }
  }

  render() {
    const { profile, currentUser, dateEvent, isMobile } = this.props;
    if (!profile || !dateEvent) {
      return <Page isLoading />;
    }

    return (
      <Page size="100%">
        <Head
          disableGoogle
          url={dateEvent.url}
          title={formatPageTitle({ dateEvent, profile })}
          description={formatPageDescription({ dateEvent, profile })}
          favicon={_.sample(profile.photos)}
          ogImage={_.first(profile.photos)}
        />

        <ViewDateEvent key={dateEvent.id} dateEventId={dateEvent.id} />
      </Page>
    );
  }
}

const ProfileWithStore = withRedux(
  initStore,
  (state, props) => {
    const dateEvent =
      dateEventSelector(props.dateEventId)(state) ||
      dateEventBySlug(
        decodeURI(props.url.query.profileId),
        decodeURI(props.url.query.slug)
      )(state);

    return {
      profile: profileSelector(state)[
        props.profileId || decodeURI(props.url.query.profileId)
      ],
      dateEventApplications: dateEventApplicationsByDateEventID(state)[
        _.get(dateEvent, "id")
      ],
      dateEvent
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(Profile));

export default ProfileWithStore;
