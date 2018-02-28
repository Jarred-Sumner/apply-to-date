import classNames from "classnames";

export default class IconButton extends React.Component {
  render() {
    const {
      onClick,
      backgroundImage,
      icon,
      size,
      disabled = false,
      shadow = "0 2px 10px 0 rgba(0,0,0,0.08)"
    } = this.props;

    return (
      <div
        className={classNames("IconButton", {
          "IconButton--disabled": disabled
        })}
        onClick={onClick}
      >
        {icon}

        <style jsx>{`
          .IconButton {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 14px;
            border-radius: 50%;
            width: ${size};
            height: ${size};
            background-image: ${backgroundImage};
            box-shadow: ${shadow};
            cursor: pointer;

            transition: transform 0.1s linear;
          }

          :global(.IconParent--disabled .IconButton),
          .IconButton--disabled {
            pointer-events: none;
            filter: grayscale(1);
          }

          .IconButton:hover {
            transform: scale(1.05, 1.05);
          }

          .IconButton:active {
            transform: scale(0.95, 0.95);
          }
        `}</style>
      </div>
    );
  }
}
