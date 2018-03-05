import {Link} from "../routes";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import Header from "../components/Header";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Text from "../components/Text";
import _ from "lodash";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getFeaturedProfiles, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Router from "next/router";
import Alert from "../components/Alert";
import Page from "../components/Page";
import withLogin from "../lib/withLogin";

class TermsOfService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      isLoggingIn: false
    };
  }

  componentDidMount() {
    if (this.props.url.query.from) {
      Alert.error("To continue, please login");
    }
  }

  setUsername = username => this.setState({ username });
  setPassword = password => this.setState({ password });

  render() {
    const { username, password, isLoggingIn } = this.state;

    return (
      <Page>
        <Head title="Terms Of Service | Apply to Date" />
        <article>
          <main>
            <Text type="PageTitle">Terms of Service</Text>

            <Text type="paragraph">
              <p>
                By downloading or using the website, these terms will
                automatically apply to you – you should make sure therefore that
                you read them carefully before using the website. You’re not
                allowed to copy, or modify the website, any part of the website,
                or our trademarks in any way. You’re not allowed to attempt to
                extract the source code of the website, and you also shouldn’t
                try to translate the website into other languages, or make
                derivative versions. the website itself, and all the trade
                marks, copyright, database rights and other intellectual
                property rights related to it, still belong to Apply to Date.{" "}
              </p>
              <p>
                Apply to Date is committed to ensuring that the website is as
                useful and efficient as possible. For that reason, we reserve
                the right to make changes to the website or to charge for its
                services, at any time and for any reason. We will never charge
                you for the website or its services without making it very clear
                to you exactly what you’re paying for.{" "}
              </p>
              <p>
                Apply to Date's website stores and processes personal data that
                you have provided to us, in order to provide our Service. It’s
                your responsibility to keep your phone and access to the website
                secure. We therefore recommend that you do not jailbreak or root
                your phone, which is the process of removing software
                restrictions and limitations imposed by the official operating
                system of your device. It could make your phone vulnerable to
                malware/viruses/malicious programs, compromise your phone’s
                security features and it could mean that the Apply to Date
                website won’t work properly or at all.
              </p>
              <p>
                You should be aware that there are certain things that Apply to
                Date will not take responsibility for. Certain functions of the
                website will require the website to have an active internet
                connection. The connection can be Wi-Fi, or provided by your
                mobile network provider, but Apply to Date cannot take
                responsibility for the website not working at full functionality
                if you don’t have access to Wi-Fi, and you don’t have any of
                your data allowance left.
              </p>
              <p>
                If you’re using the website outside of an area with Wi-Fi, you
                should remember that your terms of the agreement with your
                mobile network provider will still apply. As a result, you may
                be charged by your mobile provider for the cost of data for the
                duration of the connection while accessing the website, or other
                third party charges. In using the website, you’re accepting
                responsibility for any such charges, including roaming data
                charges if you use the website outside of your home territory
                (i.e. region or country) without turning off data roaming. If
                you are not the bill payer for the device on which you’re using
                the website, please be aware that we assume that you have
                received permission from the bill payer for using the website.
              </p>
              <p>
                Along the same lines, Apply to Date cannot always take
                responsibility for the way you use the website i.e. You need to
                make sure that your device stays charged – if it runs out of
                battery and you can’t turn it on to avail the Service, Apply to
                Date cannot accept responsibility
              </p>
              <p>
                With respect to Apply to Date’s responsibility for your use of
                the website, when you’re using the website, it’s important to
                bear in mind that although we endeavour to ensure that it is
                updated and correct at all times, we do rely on third parties to
                provide information to us so that we can make it available to
                you. Apply to Date accepts no liability for any loss, direct or
                indirect, you experience as a result of relying wholly on this
                functionality of the website.
              </p>
            </Text>

            <div className="Terms-section">
              <Text className="Section-title" type="smalltitle">
                Changes to This Terms and Conditions
              </Text>
              <Text type="paragraph">
                <p>
                  We may update our Terms and Conditions from time to time.
                  Thus, you are advised to review this page periodically for any
                  changes. We will notify you of any changes by posting the new
                  Terms and Conditions on this page. These changes are effective
                  immediately after they are posted on this page.
                </p>
              </Text>
            </div>

            <div className="Terms-section">
              <Text className="Section-title" type="smalltitle">
                Contact Us
              </Text>
              <Text type="paragraph">
                <p>
                  If you have any questions or suggestions about our Privacy
                  Policy, do not hesitate to contact us.
                </p>
              </Text>
            </div>
          </main>

          <footer />
        </article>
        <style jsx>{`
          main {
            display: flex;
            flex-direction: column;
            text-align: left;

            justify-content: left;

            margin-top: 50px;
          }

          form {
            display: grid;
            margin-top: 32px;
            margin-bottom: 14px;
            grid-auto-rows: auto;
            grid-row-gap: 14px;
          }

          footer {
            display: flex;
            flex-direction: column;
            text-align: left;
            padding-left: 22px;
          }

          p {
            margin-top: 20px;
          }

          ul {
            list-style-type: disc;
            margin-left: 50px;
            margin-top: 20px;
          }

          .Section-title {
            margin-bottom: 14px;
          }

          .Terms-section {
            margin-top: 24px;
          }
        `}</style>
      </Page>
    );
  }
}

const TermsOfServiceWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(withLogin(TermsOfService));

export default TermsOfServiceWithStore;
