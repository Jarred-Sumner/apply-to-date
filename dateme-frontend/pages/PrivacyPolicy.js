import Link from "next/link";
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

class PrivacyPolicy extends React.PureComponent {
  render() {
    return (
      <Page>
        <Head title="Privacy Policy | ApplyToDate" />
        <article>
          <main>
            <Text type="PageTitle">Privacy Policy</Text>

            <Text type="paragraph">
              <p>
                This page is used to inform website visitors regarding our
                policies with the collection, use, and disclosure of Personal
                Information if anyone decided to use our Service.{" "}
              </p>
              <p>
                If you choose to use our Service, then you agree to the
                collection and use of information in relation to this policy.
                The Personal Information that we collect is used for providing
                and improving the Service. We will not use or share your
                information with anyone except as described in this Privacy
                Policy.{" "}
              </p>
              <p>
                The terms used in this Privacy Policy have the same meanings as
                in our Terms and Conditions, which is accessible at ApplyToDate
                unless otherwise defined in this Privacy Policy.
              </p>
            </Text>

            <div className="Privacy-section">
              <Text className="Section-title" type="smalltitle">
                Information Collection and Use
              </Text>
              <Text type="paragraph">
                <p>
                  For a better experience, while using our Service, we may
                  require you to provide us with certain personally identifiable
                  information, including but not limited to email address,
                  interests, likes, gender, birthday, education history,
                  relationship interests, current city, photos, personal
                  description. The information that we request is will be
                  retained by us and used as described in this privacy policy.
                  <p>
                    The app does use third party services that may collect
                    information used to identify you.
                  </p>
                </p>
              </Text>
            </div>

            <div className="Privacy-section">
              <Text className="Section-title" type="smalltitle">
                Log Data
              </Text>
              <Text type="paragraph">
                <p>
                  We want to inform you that whenever you use our Service, in a
                  case of an error in the app we collect data and information
                  (through third party products) on your phone called Log Data.
                  This Log Data may include information such as your device
                  Internet Protocol (“IP”) address, device name, operating
                  system version, the configuration of the app when utilizing
                  our Service, the time and date of your use of the Service, and
                  other statistics.
                </p>
              </Text>
            </div>

            <div className="Privacy-section">
              <Text className="Section-title" type="smalltitle">
                Cookies
              </Text>
              <Text type="paragraph">
                <p>
                  Cookies are files with small amount of data that is commonly
                  used an anonymous unique identifier. These are sent to your
                  browser from the website that you visit and are stored on your
                  device internal memory.
                </p>

                <p>
                  This Service does not use these “cookies” explicitly. However,
                  the app may use third party code and libraries that use
                  “cookies” to collection information and to improve their
                  services. You have the option to either accept or refuse these
                  cookies and know when a cookie is being sent to your device.
                  If you choose to refuse our cookies, you may not be able to
                  use some portions of this Service.
                </p>
              </Text>
            </div>

            <div className="Privacy-section">
              <Text className="Section-title" type="smalltitle">
                Service Providers
              </Text>
              <Text type="paragraph">
                <p>
                  We may employ third-party companies and individuals due to the
                  following reasons:
                </p>

                <ul>
                  <li>To facilitate our Service;</li>{" "}
                  <li>To provide the Service on our behalf;</li>{" "}
                  <li>To perform Service-related services; or</li>{" "}
                  <li>To assist us in analyzing how our Service is used.</li>
                </ul>

                <p>
                  We want to inform users of this Service that these third
                  parties have access to your Personal Information. The reason
                  is to perform the tasks assigned to them on our behalf.
                  However, they are obligated not to disclose or use the
                  information for any other purpose.
                </p>
              </Text>
            </div>

            <div className="Privacy-section">
              <Text className="Section-title" type="smalltitle">
                Security
              </Text>
              <Text type="paragraph">
                <p>
                  We value your trust in providing us your Personal Information,
                  thus we are striving to use commercially acceptable means of
                  protecting it. But remember that no method of transmission
                  over the internet, or method of electronic storage is 100%
                  secure and reliable, and we cannot guarantee its absolute
                  security.
                </p>
              </Text>
            </div>

            <div className="Privacy-section">
              <Text className="Section-title" type="smalltitle">
                Links to Other Sites
              </Text>
              <Text type="paragraph">
                <p>
                  This Service may contain links to other sites. If you click on
                  a third-party link, you will be directed to that site. Note
                  that these external sites are not operated by us. Therefore,
                  we strongly advise you to review the Privacy Policy of these
                  websites. We have no control over and assume no responsibility
                  for the content, privacy policies, or practices of any
                  third-party sites or services.
                </p>
              </Text>
            </div>

            <div className="Privacy-section">
              <Text className="Section-title" type="smalltitle">
                Children's Privacy
              </Text>
              <Text type="paragraph">
                <p>
                  These Services do not address anyone under the age of 13. We
                  do not knowingly collect personally identifiable information
                  from children under 13. In the case we discover that a child
                  under 13 has provided us with personal information, we
                  immediately delete this from our servers. If you are a parent
                  or guardian and you are aware that your child has provided us
                  with personal information, please contact us so that we will
                  be able to do necessary actions.
                </p>
              </Text>
            </div>

            <div className="Privacy-section">
              <Text className="Section-title" type="smalltitle">
                Changes to this Privacy Policy
              </Text>
              <Text type="paragraph">
                <p>
                  We may update our Privacy Policy from time to time. Thus, you
                  are advised to review this page periodically for any changes.
                  We will notify you of any changes by posting the new Privacy
                  Policy on this page. These changes are effective immediately
                  after they are posted on this page.
                </p>
              </Text>
            </div>

            <div className="Privacy-section">
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

          .Privacy-section {
            margin-top: 24px;
          }
        `}</style>
      </Page>
    );
  }
}

const PrivacyPolicyWithStore = withRedux(initStore)(PrivacyPolicy);

export default PrivacyPolicyWithStore;
