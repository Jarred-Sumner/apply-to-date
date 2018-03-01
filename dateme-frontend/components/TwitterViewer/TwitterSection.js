import TwitterTweetEmbed from "react-tweet-embed";
import { getFeed } from "../../api";
import Text from "../Text";
import Spinner from "../Spinner";
import moment from "moment";
import Linkify from "react-linkify";
import Icon from "../Icon";
import Numeral from "numeral";
import LazyLoad from "react-lazyload";

const STATUS = {
  loading: "loading",
  error: "error",
  completed: "loaded"
};

const buildUserURL = screen_name => `https://twitter.com/${screen_name}`;

const buildTweetURL = (screen_name, id) =>
  `https://twitter.com/${screen_name}/status/${id}`;

const Tweet = ({ tweet }) => {
  return (
    <div className="Tweet">
      <div className="Topbar">
        <LazyLoad once offset={200}>
          <img className="Avatar" src={tweet.user.profile_image_url_https} />
        </LazyLoad>
        <a href={buildUserURL(tweet.user.screen_name)} target="_blank">
          <Text noWrap size="14px" weight="medium">
            {tweet.user.name}
          </Text>
        </a>
        <a href={buildUserURL(tweet.user.screen_name)} target="_blank">
          <Text noWrap size="14px" color="#8899A6" weight="thin">
            @{tweet.user.screen_name}
          </Text>
        </a>
        &middot;
        <a
          href={buildTweetURL(tweet.user.screen_name, tweet.id_str)}
          target="_blank"
        >
          <Text noWrap size="14px" color="#8899A6" weight="thin">
            {moment(tweet.created_at).fromNow()}
          </Text>
        </a>
      </div>

      <div className="Body">
        <Text weight="regular" wrap font="serif" size="16px" lineHeight="18px">
          <Linkify
            properties={{
              target: "_blank",
              className: "LinkifyLink"
            }}
          >
            {tweet.text}
          </Linkify>
        </Text>
      </div>

      <a
        target="_blank"
        href={buildTweetURL(tweet.user.screen_name, tweet.id_str)}
        className="Footer"
      >
        <div className="Metric">
          <Icon size="14px" color="#8899A6" type="retweet" />
          <Text noWrap size="14px" color="#8899A6">
            {Numeral(tweet.retweet_count).format("0,0")}
          </Text>
        </div>

        <div className="Metric">
          <Icon size="14px" color="#8899A6" type="heart" />
          <Text noWrap size="14px" color="#8899A6">
            {Numeral(tweet.favorite_count).format("0,0")}
          </Text>
        </div>
      </a>
      <style jsx>{`
        a {
          display: flex;
        }

        img {
          width: 34px;
          height: 34px;
          object-fit: contain;
          object-position: center;
          border-radius: 50%;
        }
        .Footer,
        .Topbar {
          display: grid;
          grid-auto-flow: column dense;
          grid-column-gap: 7px;
          align-items: center;
          width: max-content;
        }

        .Topbar a {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
        }

        .Footer {
          grid-column-gap: 14px;
        }

        .Metric {
          display: grid;
          grid-auto-flow: column dense;
          grid-column-gap: 7px;
          align-items: center;
        }

        .Tweet {
          border: 1px solid #d8e2e8;
          border-radius: 4px;
          padding: 14px;
          display: grid;
          grid-auto-flow: row;
          grid-row-gap: 14px;
          max-width: calc(100vw - 28px);
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default class TwitterSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: STATUS.loading,
      tweets: [],
      user: null
    };
  }

  async componentDidMount() {
    getFeed("twitter", this.props.profileId, this.props.applicationId)
      .then(response => {
        this.setState({
          tweets: response.body.data,
          user: _.get(_.first(response.body.data), "user"),
          status: STATUS.completed
        });
      })
      .catch(error => this.setState({ status: STATUS.error }));
  }

  render() {
    const { tweets, user, twitterProfile, status } = this.state;

    if (status === STATUS.completed) {
      return (
        <section>
          {user && (
            <div className="Title">
              <a
                target="_blank"
                href={buildUserURL(user.screen_name)}
                className="Followers"
              >
                <Icon type="twitter" color="#55ACEE" size="14px" />
                <Text weight="semiBold" color="#55ACEE" size="14px">
                  {Numeral(user.followers_count).format("0,0")} followers
                </Text>
              </a>
            </div>
          )}
          <div className="Tweets">
            {tweets
              .slice(0, 5)
              .map(tweet => <Tweet tweet={tweet} key={tweet.id_str} />)}
          </div>

          <style jsx>{`
            section {
              margin-top: 4rem;
              display: grid;
            }

            .Title {
              margin-bottom: 14px;
              display: flex;
              justify-content: space-between;
            }

            .Followers {
              display: grid;
              grid-auto-flow: column;
              grid-column-gap: 7px;
              align-items: center;
            }

            .Tweets {
              grid-auto-flow: row;
              grid-row-gap: 14px;
              display: grid;
            }
          `}</style>
        </section>
      );
    } else if (status === STATUS.loading) {
      return (
        <div>
          <Spinner color="#55ACEE" size={28} />

          <style jsx>{`
            div {
              display: grid;
              justify-content: center;
              align-items: center;
              grid-row-gap: 0px;
              height: 200px;
              width: 100%;
            }
          `}</style>
        </div>
      );
    } else {
      return null;
    }
  }
}
