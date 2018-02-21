import { FullStory } from "react-fullstory-component";
import { connect } from "react-redux";
import _ from "lodash";

const settings = {
  debug: process.env.NODE_ENV !== "production",
  host: "fullstory.com",
  orgKey: "AMFBS"
};

function randId() {
  return Math.random()
    .toString(36)
    .substr(2, 10);
}

class FullStoryWrapper extends React.Component {
  componentDidMount() {
    let id = localStorage["fullstoryid"];
    if (!id) {
      id = randId();
      localStorage["fullstoryid"] = id;
    }

    this.id = id;
  }

  componentWillUnmount() {
    this.id = null;
  }

  render() {
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV !== "production"
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
