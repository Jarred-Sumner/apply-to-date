import { Link } from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getVerification, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Router from "next/router";
import classNames from "classnames";
import Icon from "../components/Icon";
import Page from "../components/Page";
import qs from "qs";
import { BASE_AUTHORIZE_URL } from "../components/SocialLogin";
import withLogin from "../lib/withLogin";
import { applyMobileCookie } from "../lib/applyMobileCookie";

class VerifyAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fromMobile: false
    };
  }

  buildRoute = provider => {
    if (this.state.fromMobile) {
      return `${BASE_AUTHORIZE_URL}/${provider}?signUp=true&mobileRedirect=true`;
    } else {
      return `${BASE_AUTHORIZE_URL}/${provider}?signUp=true`;
    }
  };

  componentDidMount() {
    if (_.get(this.props, "url.query.mobile") === "true") {
      applyMobileCookie();
      this.setState({ fromMobile: true });
    }
  }

  render() {
    const email = _.get(this.props, "url.query.email");

    return (
      <div>
        <Head title="Create account | Apply to Date" />
        <Page>
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
                icon={<Icon type="instagram" color="white" />}
                href={this.buildRoute("instagram")}
                color="instagram"
              >
                Instagram
              </Button>
              <Button
                fill
                icon={<Icon type="facebook" color="white" />}
                href={this.buildRoute("facebook")}
                color="facebook"
              >
                Facebook
              </Button>
              <Button
                fill
                icon={<Icon type="twitter" color="white" />}
                href={this.buildRoute("twitter")}
                color="twitter"
              >
                Twitter
              </Button>
            </div>

            <Link
              route={`/sign-up?${qs.stringify({
                email: this.props.url.query.email,
                mobileRedirect: this.state.fromMobile || undefined
              })}`}
            >
              <a>
                <Text underline size="14px" align="center">
                  Skip
                </Text>
              </a>
            </Link>
          </main>
        </Page>
        <style jsx>{`
          main {
            margin-top: 50px;
            display: grid;
            grid-template-rows: auto auto auto;
            grid-row-gap: 30px;
            justify-content: center;
            text-align: center;
          }

          .Buttons {
            margin-top: 14px;
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

const VerifyAccountWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(withLogin(VerifyAccount));

export default VerifyAccountWithStore;
