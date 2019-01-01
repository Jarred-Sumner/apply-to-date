import Page from "../components/Page";
import LoginGate, { LOGIN_STATUSES } from "../components/LoginGate";
import { Router } from "../routes";
import withRedux from "next-redux-wrapper";
import { initStore } from "../redux/store";
import _ from "lodash";

class LoggedInUserRedirector extends React.Component {
  componentDidMount() {
    if (!this.props.currentProfile) {
      Router.replaceRoute("/");
      return;
    }

    Router.replaceRoute(`/${this.props.currentProfile.username}`);
  }

  render() {
    return <Page isLoading />;
  }
}

export default withRedux(initStore)(
  LoginGate(LoggedInUserRedirector, { loginRequired: true })
);
