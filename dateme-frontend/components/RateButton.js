import IconButton from "./IconButton";
import Icon from "./Icon";

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
    const { isMobile, animationOnly = false, value } = this.props;

    const size = "52px";

    return (
      <div
        className={classNames("RateButton", {
          "RateButton--animated": animationOnly
        })}
        onMouseLeave={this.setPendingValue(this.props.value)}
      >
        <div
          className={classNames("IconParent", {
            "IconParent--disabled": animationOnly && this.props.value !== 1,
            "IconParent--active": animationOnly && this.props.value === 1
          })}
        >
          <IconButton
            size={size}
            onClick={this.setValue(1)}
            icon={<Icon type="thumbs-down" size="28px" color="white" />}
            backgroundImage="linear-gradient(-225deg, #FD2C2C 0%, #FF8F55 100%)"
          />
        </div>

        <div
          className={classNames("IconParent", {
            "IconParent--disabled": animationOnly && this.props.value !== 5,
            "IconParent--active": animationOnly && this.props.value === 5
          })}
        >
          <IconButton
            size={size}
            onClick={this.setValue(5)}
            icon={<Icon type="thumbs-up" size="28px" color="white" />}
            backgroundImage="linear-gradient(-131deg, #00C0C7 0%, #00CDC4 32%, #00D6BD 44%, #00DEB6 55%, #00E8B3 76%, #90F3DB 100%)"
          />
        </div>

        <div
          className={classNames("IconParent", {
            "IconParent--disabled": animationOnly && this.props.value !== 0,
            "IconParent--active": animationOnly && this.props.value === 0
          })}
        >
          <IconButton
            size={size}
            onClick={this.setValue(0)}
            icon={<Icon type="idk" size="32px" color="white" />}
            backgroundImage="linear-gradient(-127deg, #3B3838 0%, #2B2B2B 100%)"
          />
        </div>

        <style jsx>{`
          div {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: ${size};
            justify-content: center;
            grid-template-columns: ${size} ${size} ${size};
            cursor: ${animationOnly ? "default" : "pointer"};
          }

          .IconParent {
            width: ${size};
            height: ${size};
            display: flex;
          }
        `}</style>
        <style jsx global>{`
          .RateButton--animated .IconParent {
            pointer-events: none;
          }

          .RateButton--animated
            .IconParent--disabled:nth-of-type(1)
            .IconButton {
            opacity: 0;
            animation: disabled-button-animation 0.4s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 0.6s;
          }

          .RateButton--animated
            .IconParent--disabled:nth-of-type(2)
            .IconButton {
            opacity: 0;
            animation: disabled-button-animation 0.4s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 0.85s;
          }

          .RateButton--animated
            .IconParent--disabled:nth-of-type(3)
            .IconButton {
            opacity: 0;
            animation: disabled-button-animation 0.4s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 1s;
          }

          .RateButton--animated .IconParent--active:nth-of-type(1) .IconButton {
            opacity: 0;
            animation: active-button-animation 0.8s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 0.6s;
          }

          .RateButton--animated .IconParent--active:nth-of-type(2) .IconButton {
            opacity: 0;
            animation: active-button-animation 0.8s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 0.85s;
          }

          .RateButton--animated .IconParent--active:nth-of-type(3) .IconButton {
            opacity: 0;
            animation: active-button-animation 0.8s ease-out;
            animation-fill-mode: forwards;
            animation-delay: 1s;
          }

          @keyframes disabled-button-animation {
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
              transform: scale(1.05);
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes active-button-animation {
            0% {
              opacity: 0;
              transform: scale(0);
            }

            25% {
              opacity: 1;
              transform: scale(1);
            }

            40% {
              opacity: 1;
              transform: scale(1.4);
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
