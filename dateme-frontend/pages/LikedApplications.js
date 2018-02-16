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
import Page from "../components/Page";
import ApplicationsBreadcrumbs from "../components/ApplicationsBreadcrumbs";
import ApplicationList from "../components/ApplicationList";

class LikedApplication extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      applications: []
    };
  }

  async componentDidMount() {
    this.loadNextApplication();
  }

  loadNextApplication = async () => {
    const response = await getReviewApplications({
      status: "approved",
      limit: 25
    });

    this.setState({
      applications: response.body.data,
      isLoading: false
    });
  };

  render() {
    const { applications, isLoading, isRating } = this.state;

    return (
      <Page isLoading={isLoading}>
        <Head title="Liked applications | Apply to date" />
        <ApplicationsBreadcrumbs />
        <article>
          <ApplicationList applications={applications} />
        </article>
      </Page>
    );
  }
}

const LikedApplicationWithStore = withRedux(initStore)(
  LoginGate(LikedApplication, { loginRequired: true })
);

export default LikedApplicationWithStore;