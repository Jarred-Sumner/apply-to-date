import TextInput from "./TextInput";
import Button from "./Button";
import { isMobile } from "../lib/Mobile";

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
      readOnly
    } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <TextInput
          {...inputProps}
          type={type || "text"}
          name={name}
          className="InlineApply-TextInput"
          required
          icon={icon}
          autoComplete={autoComplete}
          onChangeText={onChangeText}
          placeholder={placeholder}
          value={value}
          inline={!isMobile()}
        />

        <Button
          className="InlineApply-Button"
          componentType="button"
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

          @media (max-width: 500px) {
            form {
              flex-direction: column;
              padding-left: 0;
              border-radius: 6px;
            }

            form :global(.InlineApply-TextInput) {
              height: 100%;
              padding-top: 14px;
              padding-left: 14px;
              padding-bottom: 14px;

              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
            }

            form :global(.InlineApply-Button) {
              border-top-left-radius: 0;
              border-top-right-radius: 0;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
              padding-top: 14px;
              padding-bottom: 14px;
            }
          }
        `}</style>
      </form>
    );
  }
}
