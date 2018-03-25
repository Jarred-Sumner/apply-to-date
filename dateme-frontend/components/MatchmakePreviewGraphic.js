import RateButtons from "./RateButton";
import _ from "lodash";
import Thumbnail from "./Thumbnail";
import TwoThumbnail from "./TwoThumbnail";
import Text from "./Text";
import { buildUrl } from "../api";
import { buildProfileShareURL } from "../lib/routeHelpers";

export const PAIRS = [
  {
    left: "jarred",
    right: "lucy",
    value: 1
  },
  {
    left: "michaellai",
    right: "lzhong",
    value: 5
  },
  {
    left: "deanna",
    right: "cindy",
    value: 5
  },
  {
    left: "setareh",
    right: "brackin",
    value: 5
  },
  {
    left: "nivi",
    right: "dillon",
    value: 1
  },
  {
    left: "jakub",
    right: "maeganclawges",
    value: 0
  },
  {
    left: "jarred",
    right: "lucy",
    value: 0
  },
  {
    left: "jess",
    right: "sameer",
    value: 1
  },
  {
    left: "amanda",
    right: "rodrigo",
    value: 5
  },
  {
    left: "bb",
    right: "ryan",
    value: 5
  },
  {
    left: "ariellemac",
    right: "ry",
    value: 5
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
        <TwoThumbnail
          left={photoURL(currentPair.left)}
          autoSize={false}
          leftURL={buildProfileShareURL(currentPair.left)}
          right={photoURL(currentPair.right)}
          rightURL={buildProfileShareURL(currentPair.right)}
        />

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
            width: auto;
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
