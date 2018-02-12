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
      iconSize,
      inline,
      inputRef,
      ...otherProps
    } = this.props;
    return (
      <div
        className={classNames("Container", {
          "Container--inline": inline,
          "Container--block": !inline,
          "Container--withIcon": !!icon
        })}
      >
        {icon && <div className="IconContainer">{icon}</div>}

        <input
          {...otherProps}
          name={name}
          ref={inputRef}
          onChange={this.handleChange}
          required={required}
          value={value}
        />

        <style jsx>{`
          input {
            appearance: none;
            box-shadow: none;
            background-color: transparent;
            width: 100%;
            outline: none;
            font-family: Open Sans, sans-serif;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.75);
            border: 0;
            height: 100%;
          }

          .Container--block {
            border-radius: 4px;
            border: 1px solid #e3e8f0;
          }

          .Container--inline {
            border: 0;
          }

          .Container--block input {
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
        `}</style>
      </div>
    );
  }
}
