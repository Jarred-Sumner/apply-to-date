import classNames from "classnames";

export default class IconButton extends React.Component {
  render() {
    const {
      onClick,
      backgroundImage,
      backgroundColor = "transparent",
      icon,
      size,
      disabled = false,
      shadow = "none"
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
            background-color: ${backgroundColor};
            box-shadow: ${shadow};
            cursor: pointer;

            transition: transform 0.1s linear;
          }

          :global(.IconParent--disabled .IconButton),
          .IconButton--disabled {
            pointer-events: none;
            background-color: #e7e7e7;
            background-image: unset !important;
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
