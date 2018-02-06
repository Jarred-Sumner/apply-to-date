import Text from "./Text";
import classNames from "classnames";

export default class FormField extends React.Component {
  state = {
    isFocused: false
  };
  handleChange = evt => this.props.onChange(evt.target.value);
  focus = () => {
    this.inputRef && this.inputRef.focus();
  };

  setFocused = isFocused => this.setState({ isFocused });

  render() {
    const {
      icon,
      value,
      placeholder,
      name,
      type = "text",
      label,
      required = false,
      disabled = false,
      children,
      onKeyUp
    } = this.props;

    return (
      <fieldset onClick={this.focus}>
        {label && (
          <label htmlFor={name}>
            <Text type="label">{label}</Text>
          </label>
        )}
        <div
          className={classNames("InputContainer", {
            "InputContainer--focused": this.state.isFocused
          })}
        >
          {icon && <div className="IconContainer">{icon}</div>}
          {children}
          <input
            required={required}
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            min
            onFocus={() => this.setFocused(true)}
            onBlur={() => this.setFocused(false)}
            ref={inputRef => (this.inputRef = inputRef)}
            onKeyUp={onKeyUp}
            disabled={disabled}
            onChange={this.handleChange}
          />
        </div>

        <style jsx>{`
          fieldset {
            display: flex;
            flex-direction: column;
          }

          label {
            margin-bottom: 7px;
            margin-left: 22px;
            text-align: left;
          }

          .InputContainer {
            display: flex;
            position: relative;
            flex-direction: row;
            padding: 12px 22px;
            border-radius: 100px;
            border: 1px solid #e3e8f0;
          }

          .InputContainer--focused {
            border-color: #8b8f95;
          }

          input {
            display: flex;
            width: 100%;
            height: 100%;
            outline: 0;
            appearance: none;
            box-shadow: none;
            border: 0;
            font-size: 14px;
            font-weight: 400;
            font-family: Lucida Grande, Open Sans, sans-serif;
          }
        `}</style>
      </fieldset>
    );
  }
}
