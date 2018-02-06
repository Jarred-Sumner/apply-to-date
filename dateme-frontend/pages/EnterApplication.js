import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import withRedux from "next-redux-wrapper";
import { updateEntities, setCurrentUser, initStore } from "../redux/store";
import { getProfile, getCurrentUser } from "../api";
import { bindActionCreators } from "redux";
import Header from "../components/profile/Header";
import Text from "../components/Text";

class Profile extends React.Component {
  static async getInitialProps({ query, store }) {
    const profileResponse = await getProfile(query.id);
    const userResponse = await getCurrentUser();

    store.dispatch(updateEntities(profileResponse.body));

    if (userResponse.body.data) {
      store.dispatch(setCurrentUser(userResponse.body.data.id));
      store.dispatch(updateEntities(userResponse.body));
    }
  }

  render() {
    return (
      <div>
        <Head />
        <Header profile={this.props.profile} />

        <section className="Section Section--center Section--title">
          <div className="Section-row">
            <Text font="serif" size="30px" type="pageTitle" weight="bold">
              👋 Hi, I'm Lucy.
            </Text>
          </div>

          <div className="Section-row">
            <Text font="sans-serif">
              I’m an ex-software engineer and product designer, current gym-rat
              and dog mom.
            </Text>
          </div>

          <div className="Section-row" />
        </section>

        <style jsx>{`
          .Section {
            display: grid;
            grid-row-gap: 30px;
          }

          .Section-row {
            grid-row: 1fr;
          }

          .Section--center {
            justify-content: center;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}

const ProfileWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      profile: state.profile[props.url.query.id],
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(Profile);

export default ProfileWithStore;
