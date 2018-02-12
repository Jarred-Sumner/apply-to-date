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
import PageFooter from "../components/PageFooter";

const FeaturedProfile = ({ profile }) => {
  return (
    <Link href={{ pathname: `/${profile.id}` }}>
      <a className="Profile">
        <img src={_.first(profile.photos)} />
        <div className="Text">
          <div className="Title">
            <Text
              font="sans-serif"
              lineHeight="20px"
              weight="semiBold"
              size="18px"
              color="#000"
            >
              {profile.name}
            </Text>
          </div>

          <div className="Tagline">
            <Text size="14px">{profile.tagline}</Text>
          </div>
        </div>
        <style jsx>{`
          .Profile {
            background-color: #ffffff;
            box-shadow: 0 22px 30px 0 rgba(0, 0, 0, 0.12);
            cursor: pointer;
            text-decoration: none;
            text-align: left;
            width: 100%;
            border-radius: 6px;
            transition: transform 0.1s linear;
            transition-property: transform;
            display: flex;
            flex-direction: column;
          }

          .Text {
            flex: 1;
          }

          .Profile:hover {
            transform: scale(1.05);
          }

          .Profile:hover img {
            filter: saturate(1);
          }

          .Title {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }

          .Tagline {
            margin-bottom: 1.5rem;
          }

          .Title,
          .Tagline {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          img {
            object-fit: cover;
            width: 100%;
            display: flex;
            flex: 0;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            filter: saturate(0);
          }
        `}</style>
      </a>
    </Link>
  );
};

class SignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.email || ""
    };
  }

  setEmail = evt => this.setState({ email: evt.target.value });

  handleSubmit = evt => {
    evt.preventDefault();

    Router.push({
      pathname: `/sign-up`,
      query: {
        email: this.state.email
      }
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          onChange={this.setEmail}
          placeholder="Your email"
          value={this.state.email}
        />
        <Button componentType="button" inline>
          CREATE MY PAGE
        </Button>

        <style jsx>{`
          form {
            display: flex;
          }

          input {
            font-size: 14px;
            padding: 14px 22px;
            border-radius: 33px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border: 1px solid #bababa;
            border-right: 0px;
            line-height: 18px;
            color: #000;
            outline: none;
            width: auto;
            display: flex;
            flex: 1;
          }

          input::-webkit-input-placeholder {
            color: #c5cbd4;
          }

          input:focus {
            border-color: #b0b0b0;
          }
        `}</style>
      </form>
    );
  }
}

class Homepage extends React.Component {
  static async getInitialProps({ store }) {
    const profileResponse = await getFeaturedProfiles();
    store.dispatch(updateEntities(profileResponse.body));
  }

  render() {
    return (
      <div>
        <Head title="Apply to Date" />
        <Header />
        <article>
          <main>
            <div className="Copy">
              {/* <img className="Logo Logo-Home" src="/static/large-brand.svg" /> */}
              <img className="Logo Logo-Home" src="/static/animatedlogo.gif" />
              <div className="Copy-title">
                <Text font="serif" size="36px" lineHeight="44px" weight="bold">
                  A personal page to get dates
                </Text>
              </div>
              <div className="Copy-body">
                <Text size="16px" lineHeight="24px" font="sans-serif">
                  Free and quick to setup. Start pitching yourself today.
                </Text>
              </div>

              <SignupForm />
            </div>
          </main>

          <footer>
            <div className="divider" />

            <Text size="36px" font="sans-serif" color="#000">
              Featured profiles
            </Text>

            <div className="FeaturedProfiles">
              {this.props.profiles.map(profile => (
                <FeaturedProfile key={profile.id} profile={profile} />
              ))}
            </div>
          </footer>
        </article>
        <PageFooter center />

        <style jsx>{`
          article {
            max-width: 710px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 14px;
            padding-right: 14px;
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

          .Logo-Home {
            margin-left: auto;
            margin-right: auto;
            width: 97px;
            margin-bottom: 28px;
          }

          .Copy {
            max-width: 710px;
            margin: 0 auto;
            text-align: center;
          }

          .Copy-body {
            margin-top: 1rem;
            margin-bottom: 2rem;
            font-weight: 200;
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

const HomepageWithStore = withRedux(
  initStore,
  (state, props) => {
    return {
      profiles: _.values(state.profile).filter(profile => profile.featured),
      currentUser: state.currentUserId ? state.user[state.currentUserId] : null
    };
  },
  dispatch => bindActionCreators({ updateEntities, setCurrentUser }, dispatch)
)(Homepage);

export default HomepageWithStore;
