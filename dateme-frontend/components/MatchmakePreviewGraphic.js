import RateButtons from "./RateButton";
import _ from "lodash";
import Thumbnail from "./Thumbnail";
import Text from "./Text";
import { buildUrl } from "../api";
import { buildProfileShareURL } from "../lib/routeHelpers";

export const PAIRS = [
  {
    left: "jarred",
    right: "lucy",
    value: 5
  },
  {
    left: "sake",
    right: "luke",
    value: 1
  }
];

const photoURL = profileId =>
  buildUrl(`/profiles/photo?id=${encodeURIComponent(profileId)}`);

export const getPrefetchURLs = () => {
  return _.flatten(
    _.map(PAIRS, pair => [photoURL(pair.left), photoURL(pair.right)])
  );
};

export default class MatchmakePreviewGraphic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPairIndex: 0,
      pairs: _.shuffle(PAIRS)
    };
  }

  componentDidMount() {
    this.rotatePair = window.setInterval(() => {
      this.setState({ currentPairIndex: this.getNextPairIndex() });
    }, 5000);
  }

  componentWillUnmount() {
    window.clearInterval(this.rotatePair);
  }

  getNextPairIndex = () => {
    if (this.state.currentPairIndex + 1 < this.state.pairs.length) {
      return this.state.currentPairIndex + 1;
    } else {
      return 0;
    }
  };

  render() {
    const currentPair = this.state.pairs[this.state.currentPairIndex];
    const nextPair = this.state.pairs[this.getNextPairIndex()];

    return (
      <div className="Container">
        <div className="Pics">
          <a
            className="Pic"
            key={currentPair.left}
            target="_blank"
            href={buildProfileShareURL(currentPair.left)}
          >
            <Thumbnail size="105px" url={photoURL(currentPair.left)} circle />
          </a>
          <div className="Divider">
            <Text size="30px" lineHeight="40px">
              +
            </Text>
          </div>
          <a
            className="Pic"
            key={currentPair.right}
            target="_blank"
            href={buildProfileShareURL(currentPair.right)}
          >
            <Thumbnail size="105px" url={photoURL(currentPair.right)} circle />
          </a>
        </div>

        <div className="Rate">
          <RateButtons
            key={this.state.currentPairIndex}
            value={currentPair.value}
            setValue={_.noop}
            isMobile={this.props.isMobile}
            animationOnly
          />
        </div>

        <img className="Prefetch" src={photoURL(nextPair.left)} />
        <img className="Prefetch" src={photoURL(nextPair.right)} />

        <style jsx>{`
          .Container {
            display: grid;
            margin-left: auto;
            margin-right: auto;
            justify-content: center;
            grid-template-rows: auto auto;
            align-content: center;
            grid-row-gap: 28px;
            width: min-content;
            padding-top: 28px;
          }

          .Prefetch {
            opacity: 0;
            position: absolute;
            left: -999px;
            top: -999px;
            width: 1px;
            height: 1px;
            visibility: hidden;
            pointer-events: none;
          }

          .Divider {
            width: 45px;
          }

          .Pics {
            display: flex;
            align-items: center;
            justify-content: space-around;
            align-content: center;
          }

          .Pic {
            transform: scale(0);
            animation-delay: 0.2s;
            opacity: 0;
            flex: 1;
            animation: show-photo 0.8s ease-in-out;
            animation-fill-mode: forwards;
          }

          @keyframes show-photo {
            0% {
              opacity: 0;
              transform: scale(0);
            }

            50% {
              opacity: 0.9;
              transform: scale(1.1);
            }
            80% {
              opacity: 1;
              transform: scale(0.89);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @media (max-width: 500px) {
            .Container {
              padding-top: 0px;
            }
          }
        `}</style>
      </div>
    );
  }
}
