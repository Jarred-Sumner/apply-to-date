import { Link } from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Text from "../components/Text";
import _ from "lodash";
import {
  updateEntities,
  setCurrentUser,
  initStore,
  setUnreadNotificationCount
} from "../redux/store";
import {
  getReviewApplications,
  rateApplication,
  getPendingApplicationsCount
} from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import LoginGate from "../components/LoginGate";
import ReviewApplicationContainer from "../components/ReviewApplicationContainer";
import withLogin from "../lib/withLogin";
import { logEvent } from "../lib/analytics";
import { buildMobileApplicationsURL } from "../lib/routeHelpers";

class ReviewApplication extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRating: false,
      application: null,
      newApplicationsCount: 0,
      isLoadingApplication: true
    };
  }

  async componentDidMount() {
    this.loadNextApplication(true);
  }

  loadNextApplication = async (allowEmptyState = false) => {
    const response = await getReviewApplications({
      status: "submitted",
      limit: 1
    });

    const applicationsCountResponse = await getPendingApplicationsCount();

    const application = _.first(response.body.data);

    if (application || allowEmptyState) {
      this.setState({
        application: application,
        isLoadingApplication: false,
        isRating: false,
        newApplicationsCount: applicationsCountResponse.body.meta.count
      });
    } else {
      Router.replaceRoute("/matches");
    }
  };

  rate = status => {
    if (this.state.isRating) {
      return;
    }

    this.setState({
      isRating: true
    });

    return rateApplication(this.state.application.id, status)
      .then(response => {
        this.setState({
          isLoadingApplication: true
        });

        const unreadNotificationCount = _.get(
          response,
          "body.meta.unread_notification_count"
        );
        if (_.isNumber(unreadNotificationCount)) {
          this.props.setUnreadNotificationCount(unreadNotificationCount);
        }

        if (status === "approved") {
          logEvent("Application Approved");
        } else {
          logEvent("Application Rejected");
        }

        this.loadNextApplication(false);
      })
      .catch(error => handleApiError(error))
      .finally(() => this.setState({ isRating: false }));
  };

  handleYes = () => {
    this.rate("approved");
  };

  handleNo = () => {
    this.rate("rejected");
  };

  render() {
    const {
      application,
      isLoadingApplication,
      newApplicationsCount,
      isRating
    } = this.state;
    return (
      <ReviewApplicationContainer
        application={application}
        currentUser={this.props.currentUser}
        isLoading={isLoadingApplication || !this.props.currentUser}
        onYes={this.handleYes}
        newApplicationsCount={newApplicationsCount}
        mobileURL={buildMobileApplicationsURL()}
        onNo={this.handleNo}
        isMobile={this.props.isMobile}
      />
    );
  }
}

const ReviewApplicationWithStore = withRedux(initStore, null, dispatch =>
  bindActionCreators({ setUnreadNotificationCount }, dispatch)
)(
  LoginGate(ReviewApplication, {
    loginRequired: true,
    head: (
      <Head
        mobileURL={buildMobileApplicationsURL()}
        title="Applications | Apply to Date"
      />
    )
  })
);

export default ReviewApplicationWithStore;
