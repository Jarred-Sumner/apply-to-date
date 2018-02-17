import Link from "next/link";

import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getReviewApplication, rateApplication } from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import LoginGate from "../components/LoginGate";
import ReviewApplicationContainer from "../components/ReviewApplicationContainer";
import withLogin from "../lib/withLogin";

class ReviewSpecificApplication extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRating: false,
      application: null,
      isLoadingApplication: true
    };
  }

  handleYes = () => {};

  handleNo = () => {};

  async componentDidMount() {
    const response = await getReviewApplication(this.props.url.query.id);

    this.setState({
      application: response.body.data,
      isLoadingApplication: false
    });
  }

  render() {
    const { application, isLoadingApplication, isRating } = this.state;
    return (
      <ReviewApplicationContainer
        application={application}
        currentUser={this.props.currentUser}
        isLoading={isLoadingApplication}
        isRating={isRating}
      />
    );
  }
}

const ReviewApplicationWithStore = withRedux(initStore)(
  withLogin(LoginGate(ReviewSpecificApplication, { loginRequired: true }))
);

export default ReviewApplicationWithStore;
