import { FullStory } from "react-fullstory-component";
import { connect } from "react-redux";

const settings = {
  debug: process.env.NODE_ENV !== "production",
  host: "fullstory.com",
  orgKey: "AH7J1"
};

class FullStoryWrapper extends React.Component {
  render() {
    if (process.env.NODE_ENV !== "production") {
      return null;
    }

    return (
      <FullStory
        settings={settings}
        sessionId={
          this.props.currentUser ? this.props.currentUser.id : undefined
        }
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
