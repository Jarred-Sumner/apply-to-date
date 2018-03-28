import Button from "./Button";
import Icon from "./Icon";
import LoginGate, { LOGIN_STATUSES } from "./LoginGate";
import {
  buildApplyURL,
  buildApplicantApplicationURL
} from "../lib/routeHelpers";
import { updateApplication, getApplication } from "../api";
import { Router } from "../routes";
import Alert from "./Alert";
import { logEvent } from "../lib/analytics";
import _ from "lodash";
import {
  applicationsByProfile,
  currentUserSelector,
  updateEntities
} from "../redux/store";
import { connect } from "react-redux";
import ContactButton from "./ContactButton";
import { bindActionCreators } from "redux";

class AskProfileOutButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAskingOut: false
    };
  }

  componentDidMount() {
    if (
      this.props.loginStatus === LOGIN_STATUSES.loggedIn &&
      !this.props.application
    ) {
      this.checkForApplication();
    } else if (this.props.loginStatus !== LOGIN_STATUSES.loggedIn) {
      Router.prefetchRoute(buildApplyURL(this.props.profile.id));
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.loginStatus === LOGIN_STATUSES.loggedIn &&
      prevProps.loginStatus !== LOGIN_STATUSES.loggedIn &&
      !this.props.application
    ) {
      this.checkForApplication();
    }
  }

  checkForApplication = () => {
    getApplication({ profileId: this.props.profile.id }).then(response => {
      this.props.updateEntities(response.body);
    });
  };

  askOut = () => {
    if (this.state.isAskingOut) {
      return;
    }

    this.setState({ isAskingOut: true });

    return updateApplication({ profileId: this.props.profile.id })
      .then(async response => {
        const id = _.get(response, "body.data.id");
        if (id) {
          Router.pushRoute(buildApplicantApplicationURL(id));
        } else {
          Router.pushRoute(buildApplyURL(this.props.profile.id));
        }

        logEvent("Submit Application", {
          profile: this.props.profile.id,
          providers: _.keys(this.props.currentUser.profile.socialLinks),
          createAccount: false,
          auto: true
        });
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

  render() {
    const { currentUser, profile, loginStatus, application } = this.props;
    const copy = `Ask ${profile.name} out`;

    if ([LOGIN_STATUSES.guest, LOGIN_STATUSES.checking].includes(loginStatus)) {
      return (
        <Button
          size="large"
          icon={<Icon type="heart" size="14px" />}
          href={buildApplyURL(profile.id)}
          color="black"
        >
          {copy}
        </Button>
      );
    }

    if (application && !application.approved) {
      return (
        <Button
          icon={<Icon type="check" color="white" size="14px" />}
          color="black"
          size="large"
          href={buildApplicantApplicationURL(application.id)}
        >
          Asked out
        </Button>
      );
    } else if (application && application.approved) {
      return (
        <ContactButton
          size="large"
          socialLinks={profile.socialLinks}
          phone={application.profilePhone}
        />
      );
    } else {
      if (currentUser && currentUser.isAutoApplyEnabled) {
        return (
          <Button
            onClick={this.askOut}
            size="large"
            icon={<Icon type="heart" size="14px" />}
            color="black"
            pending={this.state.isAskingOut}
          >
            {copy}
          </Button>
        );
      } else {
        return (
          <Button
            icon={<Icon type="heart" size="14px" />}
            size="large"
            href={buildApplyURL(profile.id)}
            color="black"
          >
            {copy}
          </Button>
        );
      }
    }
  }
}

export default connect(
  (state, props) => ({
    application: _.first(applicationsByProfile(state)[props.profile.id]),
    currentUser: currentUserSelector(state),
    loginStatus: state.loginStatus
  }),
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(AskProfileOutButton);
