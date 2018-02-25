import Button from "./Button";
import Icon from "./Icon";
import LoginGate from "./LoginGate";
import {
  buildApplyURL,
  buildApplicantApplicationURL
} from "../lib/routeHelpers";
import { updateApplication } from "../api";
import { Router } from "../routes";
import Alert from "./Alert";

class AskProfileOutButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAskingOut: false
    };
  }

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
    const { currentUser, profile } = this.props;
    const copy = `Ask ${profile.name} out`;
    if (currentUser && currentUser.isAutoApplyEnabled) {
      return (
        <Button
          size="large"
          onClick={this.askOut}
          icon={<Icon type="heart" size="14px" />}
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
        >
          {copy}
        </Button>
      );
    }
  }
}

export default LoginGate(AskProfileOutButton);