import { Link } from "../routes";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import Head from "../components/head";
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
  getReviewApplication,
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
import {
  buildMobileApplicationsURL,
  buildMobileApplicationURL
} from "../lib/routeHelpers";

class ReviewSpecificApplication extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRating: false,
      application: null,
      isLoadingApplication: true,
      newApplicationsCount: 0
    };
  }

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
      })
      .catch(error => handleApiError(error))
      .finally(() => this.setState({ isRating: false }));
  };

  handleYes = async () => {
    await this.rate("approved");
    Router.replaceRoute("/applications");
  };

  handleNo = async () => {
    await this.rate("rejected");
    Router.replaceRoute("/applications");
  };

  async componentDidMount() {
    const response = await getReviewApplication(this.props.url.query.id);
    const applicationsCountResponse = await getPendingApplicationsCount();

    this.setState({
      application: response.body.data,
      isLoadingApplication: false,
      newApplicationsCount: applicationsCountResponse.body.meta.count
    });
  }

  render() {
    const {
      application,
      isLoadingApplication,
      isRating,
      newApplicationsCount
    } = this.state;
    return (
      <ReviewApplicationContainer
        application={application}
        currentUser={this.props.currentUser}
        onYes={this.handleYes}
        onNo={this.handleNo}
        mobileURL={buildMobileApplicationURL(_.get(application, "id"))}
        isLoading={isLoadingApplication}
        newApplicationsCount={newApplicationsCount}
        isRating={isRating}
        isMobile={this.props.isMobile}
      />
    );
  }
}

const ReviewApplicationWithStore = withRedux(initStore, null, dispatch =>
  bindActionCreators({ setUnreadNotificationCount }, dispatch)
)(
  LoginGate(ReviewSpecificApplication, {
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
