import Star from "./Star";
import classNames from "classnames";

export default class RateButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || 0
    };
  }

  componentWillReceiveProps(props) {
    if (props.value !== this.props.value) {
      this.setState({
        value: props.value
      });
    }
  }

  setPendingValue = value => evt => {
    if (!this.props.animationOnly) {
      this.setState({ value });
    }
  };
  setValue = value => evt => {
    this.props.setValue(value);
  };

  render() {
    const { value } = this.state;
    const { isMobile, animationOnly = false } = this.props;

    return (
      <div
        className={classNames("RateButton", {
          "RateButton--animated": animationOnly
        })}
        onMouseLeave={this.setPendingValue(this.props.value)}
      >
        <Star
          onMouseOver={this.setPendingValue(1)}
          onClick={this.setValue(1)}
          filledIn={value >= 1}
          size={isMobile ? 36 : 60}
        />
        <Star
          onMouseOver={this.setPendingValue(2)}
          onClick={this.setValue(2)}
          filledIn={value >= 2}
          size={isMobile ? 36 : 60}
        />
        <Star
          onMouseOver={this.setPendingValue(3)}
          onClick={this.setValue(3)}
          filledIn={value >= 3}
          size={isMobile ? 36 : 60}
        />
        <Star
          onMouseOver={this.setPendingValue(4)}
          onClick={this.setValue(4)}
          filledIn={value >= 4}
          size={isMobile ? 36 : 60}
        />
        <Star
          onMouseOver={this.setPendingValue(5)}
          onClick={this.setValue(5)}
          filledIn={value >= 5}
          size={isMobile ? 36 : 60}
        />

        <style jsx>{`
          div {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 14px;
            justify-content: center;
            grid-template-columns: repeat(5, ${isMobile ? "36px" : "60px"});
            cursor: ${animationOnly ? "default" : "pointer"};
          }
        `}</style>
        <style jsx global>{`
          .RateButton--animated .StarIcon:nth-of-type(1) {
            opacity: 0;
            animation: star-animation 0.4s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 0.6s;

            transform-origin: 50% 50%;
          }

          .RateButton--animated .StarIcon:nth-of-type(2) {
            opacity: 0;
            animation: star-animation 0.4s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 0.85s;
            transform-origin: 50% 50%;
          }

          .RateButton--animated .StarIcon:nth-of-type(3) {
            opacity: 0;
            animation: star-animation 0.4s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 1s;
            transform-origin: 50% 50%;
          }

          .RateButton--animated .StarIcon:nth-of-type(4) {
            opacity: 0;
            animation: star-animation 0.4s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 1.2s;
            transform-origin: 50% 50%;
          }

          .RateButton--animated .StarIcon:nth-of-type(5) {
            opacity: 0;
            animation: star-animation 0.4s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 1.4s;
            transform-origin: 50% 50%;
          }

          @keyframes star-animation {
            0% {
              opacity: 0;
              transform: scale(0);
            }

            25% {
              opacity: 1;
              transform: scale(0.5);
            }

            80% {
              opacity: 1;
              transform: scale(1.2);
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }
}
