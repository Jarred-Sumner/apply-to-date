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

const BASE_AUTHORIZE_URL = "http://localhost:3001/auth";

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

            <div className="Row">
              <Text size="16px">
                Please verify your identity with one of the social networks
                below.
              </Text>
            </div>

            <div className="Row Buttons">
              <Button
                fill
                href={`${BASE_AUTHORIZE_URL}/instagram`}
                color="instagram"
              >
                Instagram
              </Button>
              <Button
                fill
                href={`${BASE_AUTHORIZE_URL}/facebook`}
                color="facebook"
              >
                Facebook
              </Button>
              <Button
                fill
                href={`${BASE_AUTHORIZE_URL}/twitter`}
                color="twitter"
              >
                Twitter
              </Button>
            </div>
          </main>
        </article>
        <style jsx>{`
          article {
            max-width: 710px;
            margin-left: auto;
            margin-right: auto;
          }

          main {
            margin-top: 30px;
            display: grid;
            grid-template-rows: auto auto auto;
            grid-row-gap: 30px;
            justify-content: center;
            text-align: center;
          }

          .Buttons {
            margin-top: 28px;
            display: grid;
            grid-template-columns: minmax(180px, 300px);
            grid-template-rows: 42px;
            justify-content: center;
            grid-row-gap: 28px;
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
