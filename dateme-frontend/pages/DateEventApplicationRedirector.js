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
  dateEventApplicationSelector
} from "../redux/store";
import { getDateEventApplication } from "../api";
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
  buildMobileViewProfileURL,
  buildCreatorDateEventApplicationURL
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

class Profile extends React.Component {
  static async getInitialProps({ query, store, req, res, isServer }) {
    if (!isServer) {
      const response = await getDateEventApplication(query.id);

      const normalizedResponse = normalizeApiResponse(response.body);
      store.dispatch(updateEntities(response.body));

      const dateEventApplication = _.first(
        _.values(normalizedResponse.date_event_application)
      );

      if (dateEventApplication) {
        Router.replaceRoute(
          buildCreatorDateEventApplicationURL(
            dateEventApplication.id,
            dateEventApplication.dateEventId
          )
        );
      }
    }
  }

  async componentDidMount() {
    if (!this.props.dateEventApplication) {
      const response = await getDateEventApplication(this.props.url.query.id);

      const normalizedResponse = normalizeApiResponse(response.body);
      this.props.updateEntities(response.body);

      const dateEventApplication = _.first(
        _.values(normalizedResponse.date_event_application)
      );

      if (dateEventApplication) {
        Router.replaceRoute(
          buildCreatorDateEventApplicationURL(
            dateEventApplication.id,
            dateEventApplication.profileId
          )
        );
      }
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
      dateEventApplication: dateEventApplicationSelector(props.url.query.id)(
        state
      )
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(Profile));

export default ProfileWithStore;
