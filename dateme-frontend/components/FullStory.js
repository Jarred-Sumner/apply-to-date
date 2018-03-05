import { FullStory } from "react-fullstory-component";
import { connect } from "react-redux";
import _ from "lodash";
import Storage from "../lib/Storage";

const settings = {
  debug: process.env.NODE_ENV !== "production",
  host: "fullstory.com",
  orgKey: "AMFBS"
};

class FullStoryWrapper extends React.Component {
  async componentDidMount() {
    this.id = await Storage.fullstoryId();
  }

  componentWillUnmount() {
    this.id = null;
  }

  render() {
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV !== "production" ||
      process.env.IS_FULLSTORY_ENABLED === "false"
    ) {
      return null;
    }

    return (
      <FullStory
        settings={settings}
        sessionId={this.id}
        custom={{
          displyName: _.get(this.props, "currentUser.profile.name"),
          email: _.get(this.props, "currentUser.email")
        }}
      />
    );
  }
}

export default connect(state => {
  return {
    currentUser:
      state && state.currentUserId ? state.user[state.currentUserId] : null
  };
})(FullStoryWrapper);
