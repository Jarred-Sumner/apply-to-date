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

    if (this.props.currentProfile.region === "bay_area") {
      return Router.replaceRoute("/dates");
    } else if (this.props.currentUser.shuffleStatus === "shuffle_allowed") {
      return Router.replaceRoute("/shuffle");
    } else {
      return Router.replaceRoute("/matchmake");
    }
  }

  render() {
    return <Page isLoading />;
  }
}

export default withRedux(initStore)(
  LoginGate(LoggedInUserRedirector, { loginRequired: true })
);
