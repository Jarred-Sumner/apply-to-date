import TextInput from "./TextInput";
import Button from "./Button";
import { isMobile } from "../lib/Mobile";
import classNames from "classnames";

export default class InlineTextForm extends React.Component {
  handleSubmit = evt => {
    evt.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const {
      type,
      name,
      icon,
      onChangeText,
      placeholder,
      value,
      buttonChildren,
      autoComplete,
      inputProps = {},
      buttonFill,
      size = "normal",
      hideInputOnMobile = false,
      readOnly
    } = this.props;

    return (
      <form
        className={classNames("Form", {
          "Form--hideInputOnMobile": hideInputOnMobile,
          "Form--showInputOnMobile": !hideInputOnMobile,
          "Form--normalSize": size === "normal",
          "Form--smallSize": size === "small"
        })}
        onSubmit={this.handleSubmit}
      >
        <TextInput
          {...inputProps}
          type={type || "text"}
          name={name}
          className="InlineApply-TextInput"
          required
          icon={icon}
          fake={readOnly}
          autoComplete={autoComplete}
          onChangeText={onChangeText}
          placeholder={placeholder}
          value={value}
          inline={!isMobile()}
        />

        <Button
          className="InlineApply-Button"
          componentType="button"
          size={size}
          fill={buttonFill}
          icon={hideInputOnMobile ? icon : undefined}
          inline={!isMobile()}
        >
          {buttonChildren}
        </Button>

        <style jsx>{`
          form {
            display: flex;
            border: 1px solid #f0f2f7;
            padding-left: 24px;
            border-radius: 100px;
          }

          :global(.InlineApply-TextInput) {
            padding-right: 12px;
          }

          @media (max-width: 500px) {
            .Form {
              flex-direction: column;
              padding-left: 0;
              border-radius: 6px;
            }

            .Form--hideInputOnMobile :global(.InlineApply-TextInput) {
              display: none;
            }

            .Form--hideInputOnMobile {
              border: none;
            }

            .Form--showInputOnMobile :global(.InlineApply-TextInput) {
              height: 100%;
              padding-top: 7px;
              padding-left: 0px;
              padding-bottom: 7px;

              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
            }

            .Form--showInputOnMobile :global(.InlineApply-Button) {
              border-top-left-radius: 0;
              border-top-right-radius: 0;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
              padding-top: 14px;
              padding-bottom: 14px;
            }

            .Form--normalSize.Form--hideInputOnMobile
              :global(.InlineApply-Button) {
              border-radius: 100px;
              padding-top: 14px;
              padding-bottom: 14px;
            }
          }
        `}</style>
      </form>
    );
  }
}
