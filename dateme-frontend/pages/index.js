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
import withLogin from "../lib/withLogin";
import LazyLoad from "react-lazyload";

const FeaturedProfile = ({ profile }) => {
  return (
    <Link href={{ pathname: `/${profile.id}` }}>
      <a className="Profile">
        <LazyLoad offset={100} height={250}>
          <img src={_.first(profile.photos)} />
        </LazyLoad>
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
            <Text size="14px">{(profile.tagline || "").substr(0, 100)}</Text>
          </div>
        </div>
        <style jsx>{`
          .Profile {
            background-color: #ffffff;
            cursor: pointer;
            text-decoration: none;
            text-align: left;
            width: 100%;
            height: 100%;
            border-radius: 6px;
            display: flex;
            flex-shrink: 0;
            flex-grow: 0;
            flex-direction: column;
          }

          .Text {
            flex: 1;
          }

          .Profile:hover img {
            opacity: 0.85;
          }

          .Title {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }

          .Tagline {
            margin-bottom: 1.5rem;
          }

          img {
            object-fit: cover;
            flex: 0 0 250px;
            flex-shrink: 0;
            display: flex;
            width: 250px;
            height: 250px;
            opacity: 1;
            transition: opacity 0.1s linear;
          }

          @media (max-width: 500px) {
            .Profile {
              margin-bottom: 2em;
            }
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
      pathname: `/sign-up/verify`,
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
        <Head
          title="Apply to Date – your own game of The Bachelor(ette)"
          url={`${process.env.DOMAIN}/`}
          disableGoogle={false}
        />
        <Header />
        <article>
          <main>
            <div className="Copy">
              <img className="Logo Logo-Home" src="/static/animatedlogo.gif" />
              <div className="Copy-title">
                <Text font="serif" size="36px" lineHeight="44px" weight="bold">
                  Your own game of The Bachelor(ette)
                </Text>
              </div>
              <div className="Copy-body">
                <Text size="16px" lineHeight="24px" font="sans-serif">
                  Create a page where people apply to go on a date with you. You
                  pick the winners.
                </Text>
              </div>

              <SignupForm />
            </div>
          </main>
        </article>

        {!_.isEmpty(this.props.profiles) && (
          <footer>
            <div className="divider" />

            <Text size="36px" font="sans-serif" color="#000">
              Featured pages
            </Text>

            <div className="FeaturedProfiles-wrapper">
              <div className="FeaturedProfiles">
                {this.props.profiles.map(profile => (
                  <FeaturedProfile key={profile.id} profile={profile} />
                ))}
              </div>
            </div>
          </footer>
        )}

        <article>
          <PageFooter center />
        </article>
        <style jsx>{`
          article {
            max-width: 710px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 14px;
            padding-right: 14px;
            overflow-x: hidden;
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
            overflow-x: hidden;
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

          .FeaturedProfiles-wrapper {
            padding-top: 4rem;
            padding-bottom: 6rem;
            padding-left: 28px;
            padding-right: 28px;

            overflow-x: auto;
            width: 100vw;
          }

          .FeaturedProfiles {
            display: grid;
            grid-column-gap: 2rem;
            grid-row-gap: 2rem;
            text-align: center;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
            grid-template-columns: 250px 250px 250px 250px;
            grid-template-rows: 1fr 1fr 1fr 1fr;
          }

          @media (max-width: 1100px) {
            .FeaturedProfiles {
              grid-template-columns: 250px 250px 250px;
              grid-template-rows: 1fr 1fr 1fr;
            }
          }

          @media (max-width: 900px) {
            .FeaturedProfiles {
              grid-template-columns: 250px 250px;
              grid-template-rows: 1fr 1fr;
            }
          }

          @media (max-width: 554px) {
            .FeaturedProfiles-wrapper {
              padding-left: 14px;
              padding-right: 14px;
            }

            .FeaturedProfiles {
              grid-auto-flow: row dense;
              grid-auto-rows: auto;
              grid-template-columns: 250px;
              grid-template-rows: 1fr;
              justify-content: center;
            }
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
)(withLogin(Homepage));

export default HomepageWithStore;
