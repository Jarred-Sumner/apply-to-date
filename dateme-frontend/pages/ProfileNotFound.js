import Page from "../components/Page";
import Text from "../components/Text";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getFeaturedProfiles, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Router from "next/router";
import withRedux from "next-redux-wrapper";
import Alert from "../components/Alert";
import withLogin from "../lib/withLogin";
import Head from "../components/head";

class ProfileNotFound extends React.Component {
  render() {
    return (
      <Page>
        <Head title="Page not found" />
        <article>
          <Text size="48px" align="center" lineHeight="36px">
            🤔
          </Text>
          <Text type="title" align="center">
            Hidden or not found
          </Text>
          <Text type="subtitle">
            Maybe the page you came from hasn't gone live yet, or maybe the URL
            doesn't go anywhere.
          </Text>
        </article>
        <style jsx>{`
          article {
            display: grid;
            justify-content: center;
            margin-top: 48px;
            margin-bottom: 48px;
            grid-auto-flow: row;
            grid-row-gap: 14px;
          }
        `}</style>
      </Page>
    );
  }
}

const ProfileNotFoundWithStore = withRedux(initStore, null, dispatch =>
  bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(withLogin(ProfileNotFound));

export default ProfileNotFoundWithStore;
