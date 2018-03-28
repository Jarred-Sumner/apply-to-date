import { Link } from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import {
  getReviewApplications,
  rateApplication,
  getPendingApplicationsCount
} from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import LoginGate from "../components/LoginGate";
import Page from "../components/Page";
import ApplicationsBreadcrumbs from "../components/ApplicationsBreadcrumbs";
import ApplicationList from "../components/ApplicationList";
import withLogin from "../lib/withLogin";

class PassedApplications extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      applications: [],
      newApplicationsCount: 0
    };
  }

  async componentDidMount() {
    this.loadNextApplication();
  }

  loadNextApplication = async () => {
    const response = await getReviewApplications({
      status: "rejected",
      limit: 25
    });

    const applicationsCountResponse = await getPendingApplicationsCount();
    const newApplicationsCount = applicationsCountResponse.body.meta.count;

    this.setState({
      applications: response.body.data,
      isLoading: false,
      newApplicationsCount
    });
  };

  render() {
    const {
      applications,
      isLoading,
      isRating,
      newApplicationsCount
    } = this.state;

    return (
      <Page isLoading={isLoading}>
        <Head title="Passed applications | Apply to date" />
        <ApplicationsBreadcrumbs newApplicationsCount={newApplicationsCount} />
        <article>
          <ApplicationList applications={applications} />
        </article>
      </Page>
    );
  }
}

const PassedApplicationWithStore = withRedux(initStore)(
  withLogin(LoginGate(PassedApplications, { loginRequired: true }))
);

export default PassedApplicationWithStore;
