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
  normalizeApiResponse
} from "../redux/store";
import {
  getReviewApplications,
  rateApplication,
  getApplications
} from "../api";
import { bindActionCreators } from "redux";
import { Router } from "../routes";
import Alert, { handleApiError } from "../components/Alert";
import LoginGate from "../components/LoginGate";
import Page from "../components/Page";
import ApplicationsBreadcrumbs from "../components/ApplicationsBreadcrumbs";
import ApplicationList from "../components/ApplicationList";
import withLogin from "../lib/withLogin";
import { connect } from "react-redux";

class LikedApplication extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      applications: []
    };
  }

  async componentDidMount() {
    // Backwards comaptibilty
    if (this.props.url.asPath === "/applications/liked") {
      Router.replaceRoute("/matches");
    }
    this.loadNextApplication();
  }

  loadNextApplication = async () => {
    const response = await getReviewApplications({
      status: "approved",
      limit: 25
    });

    const reviewApplications = response.body.data;

    const applicationsResponse = await getApplications();
    this.props.updateEntities(applicationsResponse.body);

    const { application } = normalizeApiResponse(applicationsResponse.body);

    this.setState({
      applications: _.orderBy(
        _.concat(reviewApplications, _.values(application)),
        "createdAt",
        "desc"
      ).map(application => {
        if (application.type === "application") {
          return application.profile;
        } else {
          return application;
        }
      }),
      isLoading: false
    });
  };

  render() {
    const { applications, isLoading, isRating } = this.state;

    return (
      <Page isLoading={isLoading}>
        <Head title="Matches | Apply to date" />
        <ApplicationsBreadcrumbs />
        <article>
          <ApplicationList applications={applications} />
        </article>
      </Page>
    );
  }
}

const LikedApplicationWithStore = withRedux(initStore, null, dispatch =>
  bindActionCreators({ updateEntities }, dispatch)
)(LoginGate(LikedApplication, { loginRequired: true }));

export default LikedApplicationWithStore;
