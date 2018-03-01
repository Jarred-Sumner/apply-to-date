import RateButtons from "./RateButtons";
import _ from "lodash";

export default class AnimatedRateButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };
  }

  render() {
    return (
      <RateButtons animationOnly value={this.state.value} setValue={_.noop} />
    );
  }
}
