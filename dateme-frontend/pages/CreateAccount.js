import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getFeaturedProfiles, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Router from "next/router";
import classNames from "classnames";

const EXTERNAL_ACCOUNT_LABELS = {
  twitter: "Twitter",
  youtube: "YouTube",
  facebook: "Facebook"
};

const ExternalAccount = ({ provider, isVerified = false }) => {
  return (
    <div
      className={classNames("ExternalAccount", `ExternalAccount-${provider}`)}
    >
      <div className="Provider">{EXTERNAL_ACCOUNT_LABELS[provider]}</div>
    </div>
  );
};

class CreateAccount extends React.Component {
  static async getInitialProps({ store, query }) {}

  render() {
    return (
      <div>
        <Head title="Create account | ApplyToDate" />
        <Header />
        <article>
          <main>
            <Text type="PageTitle">Create account</Text>
          </main>
        </article>
        <style jsx>{`
          article {
            max-width: 1080px;
            margin-left: auto;
            margin-right: auto;
          }

          main {
            display: flex;
            margin-top: 6rem;
            margin-bottom: 6rem;

            justify-content: center;
          }

          footer {
            display: flex;
            flex-direction: column;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}

const CreateAccountWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(CreateAccount);

export default CreateAccountWithStore;
