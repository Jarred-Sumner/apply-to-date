import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getReviewApplications, rateApplication } from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import LoginGate from "../components/LoginGate";
import ReviewApplicationContainer from "../components/ReviewApplicationContainer";
import withLogin from "../lib/withLogin";
import { logEvent } from "../lib/analytics";

class ReviewApplication extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRating: false,
      application: null,
      isLoadingApplication: true
    };
  }

  async componentDidMount() {
    this.loadNextApplication();
  }

  loadNextApplication = async () => {
    const response = await getReviewApplications({
      status: "submitted",
      limit: 1
    });

    this.setState({
      application: _.first(response.body.data),
      isLoadingApplication: false,
      isRating: false
    });
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

        if (status === "approved") {
          logEvent("Application Approved");
        } else {
          logEvent("Application Rejected");
        }

        this.loadNextApplication();
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
    const { application, isLoadingApplication, isRating } = this.state;
    return (
      <ReviewApplicationContainer
        application={application}
        currentUser={this.props.currentUser}
        isLoading={isLoadingApplication || !this.props.currentUser}
        onYes={this.handleYes}
        onNo={this.handleNo}
      />
    );
  }
}

const ReviewApplicationWithStore = withRedux(initStore, null, null, null, {
  pure: false
})(LoginGate(ReviewApplication, { loginRequired: true }));

export default ReviewApplicationWithStore;
