import classNames from "classnames";
import Icon from "./Icon";

export default class TextInput extends React.Component {
  handleChange = evt => {
    if (this.props.onChange) {
      this.props.onChange(evt);
    } else if (this.props.onChangeText) {
      this.props.onChangeText(evt.target.value);
    }
  };

  render() {
    const {
      name,
      required,
      value,
      icon,
      className,
      iconSize,
      inline,
      inputRef,
      onChangeText,
      disabled,
      onChange,
      children,
      rounded,
      fake = false,
      ...otherProps
    } = this.props;
    return (
      <div
        className={classNames("Container", className, {
          "Container--inline": inline,
          "Container--block": !inline,
          "Container--disabled": !!disabled,
          "Container--withIcon": !!icon,
          "Container--rounded": rounded
        })}
      >
        {icon && <div className="IconContainer">{icon}</div>}

        {fake ? (
          <div className="Input" {...otherProps}>
            {value}
          </div>
        ) : (
          <input
            className="Input"
            {...otherProps}
            name={name}
            ref={inputRef}
            onChange={this.handleChange}
            required={required}
            value={value}
            disabled={disabled}
          />
        )}

        {children}

        <style jsx>{`
          .Input {
            appearance: none;
            box-shadow: none;
            background-color: transparent;
            width: 100%;
            display: flex;
            outline: none;
            font-family: Open Sans, sans-serif;
            align-items: center;
            align-content: center;
            font-size: 14px;
            color: #000;
            border: 0;
            height: 100%;
          }

          .Container--block {
            border-radius: 4px;
            border: 1px solid #e3e8f0;
          }

          .Container--block.Container--disabled {
            background-color: #f0f2f7;
          }

          .Container--inline {
            border: 0;
          }

          .Container--block .Input {
            padding: 12px 24px;
          }

          .Container {
            display: flex;
            position: relative;
            width: 100%;
            background-color: white;
          }

          .Container--block:hover {
            background-color: #fcfcfc;
          }

          .Container--block.Container--disabled:hover {
            background-color: #f0f2f7;
          }

          .IconContainer {
            height: 100%;
            pointer-events: none;
            display: flex;
            justify-content: center;
            margin-top: auto;
            margin-bottom: auto;
            align-items: center;
            pointer-events: none;
            margin-right: 12px;
          }

          .Container--rounded {
            border-radius: 100px;
          }

          @media (max-width: 500px) {
            .Container--withIcon.Container--block .IconContainer {
              padding-left: 14px;
              margin-right: 0;
            }
          }
        `}</style>
      </div>
    );
  }
}
