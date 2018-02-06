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

class Login extends React.Component {
  static async getInitialProps({ store, query }) {}

  render() {
    return (
      <div>
        <Head title="Login | ApplyToDate" />
        <Header />
        <article>
          <main>
            <Text type="pageTitle">Login</Text>
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

          .divider {
            height: 2px;
            width: 269px;
            margin-bottom: 6rem;
            margin-left: auto;
            margin-right: auto;
            background-color: #0aca9b;
          }

          .Copy {
            max-width: 860px;
            margin-left: 4rem;
          }

          .Copy-body {
            margin-top: 2rem;
            margin-bottom: 2rem;
          }

          .FeaturedProfiles {
            margin-top: 4rem;
            margin-bottom: 6rem;
            display: grid;
            grid-column-gap: 2rem;
            grid-template-rows: 1fr;
            grid-auto-flow: column dense;
            text-align: center;
            justify-content: center;
            grid-auto-columns: minmax(auto, 300px);
          }
        `}</style>
      </div>
    );
  }
}

const LoginWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(Login);

export default LoginWithStore;
