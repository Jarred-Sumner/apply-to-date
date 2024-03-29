import Text from "./Text";
import classNames from "classnames";
import UnwrappedPlacesAutocomplete from "react-places-autocomplete";
import Checkbox from "./Checkbox";
import _ from "lodash";
import Radio from "./Radio";
import PillButton from "./PillButton";
import TextInput from "./TextInput";
import scriptLoader from "react-async-script-loader";
import DatePicker from "./DatePicker";
import moment from "moment";
import { SPACING } from "../helpers/styles";

const PlacesAutocomplete = scriptLoader(
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyD_ad15stG5b8YA-oVUoneLHmIW7pWpa3w&libraries=places"
)(
  ({ isScriptLoaded, ...props }) =>
    isScriptLoaded ? <UnwrappedPlacesAutocomplete {...props} /> : null
);

export { geocodeByAddress, getLatLng } from "react-places-autocomplete";
export { default as CategoryFormField } from "./FormField/CategoryFormField";
export { default as PasswordFormField } from "./FormField/PasswordFormField";
export { default as UsernameFormField } from "./FormField/UsernameFormField";
export { default as SexFormField } from "./FormField/SexFormField";
export { default as TOSFormField } from "./FormField/TermsOfService";
export {
  default as InterestedInFormField
} from "./FormField/InterestedInFormField";

const Suggestion = ({ suggestion, isSelected }) => (
  <div className={classNames("Wrapper", { "Wrapper--selected": isSelected })}>
    <div className="Suggestion">
      <Text size="14px" font="sans-serif">
        {suggestion}
      </Text>
    </div>
    <style jsx>{`
      .Wrapper {
        border-bottom: 1px solid #f0f2f7;
        background-color: #fff;
      }

      .Wrapper--selected,
      .Wrapper:hover {
        background-color: #f0f2f7;
      }

      .Suggestion {
        padding: 14px 22px;
        text-align: left;
      }
    `}</style>
  </div>
);

export default class FormField extends React.Component {
  state = {
    isFocused: false
  };
  handleChange = evt => {
    this.props.onChange(evt.target.value);
  };
  handlePillChange = value => this.props.onChange(value);
  handleLocationChange = location => {
    this.props.onChange(location);
  };
  handleDateChange = date => {
    this.props.onChange(date ? moment(date).toString() : null);
  };
  handleRadioChange = evt =>
    this.props.onChange(evt.target.value, evt.target.name);
  handleCheckboxChange = evt =>
    this.props.onChange(evt.target.name, evt.target.checked);
  focus = () => {
    this.inputRef && this.inputRef.focus();
  };

  setFocused = (isFocused, evt) => {
    if (isFocused && !this.state.isFocused && this.props.onFocus) {
      this.props.onFocus(evt);
    }

    this.setState({ isFocused });
  };

  renderInput = () => {
    const {
      onKeyUp,
      value,
      placeholder,
      type,
      name,
      autoFocus = false,
      autoCapitalize = "off",
      autoCorrect = "off",
      required = false,
      disabled = false,
      checkboxes = [],
      radios = []
    } = this.props;

    if (type === "checkbox") {
      return (
        <div className="Checkboxes">
          {checkboxes.map((checkbox, index) => (
            <Checkbox
              key={index}
              checked={checkbox.checked}
              label={checkbox.label}
              size={checkbox.size || "default"}
              name={checkbox.name}
              onChange={this.handleCheckboxChange}
            />
          ))}
          <style jsx>{`
            .Checkboxes {
              display: flex;
              justify-content: space-between;
              width: 100%;
            }
          `}</style>
        </div>
      );
    } else if (type === "radio") {
      return (
        <div className="Radios">
          {radios.map((radio, index) => (
            <Radio
              key={index}
              selected={radio.value === value}
              label={radio.label}
              value={radio.value}
              name={name}
              onChange={this.handleRadioChange}
            />
          ))}
          <style jsx>{`
            .Radios {
              display: flex;
              justify-content: space-between;
              width: 100%;
            }
          `}</style>
        </div>
      );
    } else if (type === "pill") {
      return (
        <div className="Pills">
          {radios.map((radio, index) => (
            <div className="Pill">
              <PillButton
                key={index}
                selected={radio.value === value}
                value={radio.value}
                name={name}
                onChange={this.handlePillChange}
              >
                {radio.label}
              </PillButton>
            </div>
          ))}
          <style jsx>{`
            .Pills {
              display: flex;
              flex-wrap: wrap;
              width: 100%;
            }

            .Pill {
              margin-right: ${SPACING.SMALL}px;
              margin-bottom: ${SPACING.SMALL}px;
            }

            .Pill:last-child {
              margin-right: 0;
              margin-bottom: 0;
            }
          `}</style>
        </div>
      );
    } else if (type === "location") {
      return (
        <PlacesAutocomplete
          classNames={{
            input: "LocationInput",
            root: "LocationInputRoot"
          }}
          renderSuggestion={({ suggestion, ...otherProps }) => {
            return (
              <Suggestion
                suggestion={suggestion}
                isSelected={value === suggestion}
              />
            );
          }}
          styles={{
            autocompleteContainer: {
              position: "absolute",
              margin: 0,
              marginTop: "11px",
              padding: "0",
              left: 0,
              right: 0,
              zIndex: 9999,
              backgroundColor: "white",
              border: "0",
              width: "100%",
              boxShadow: "0 30px 40px 0 rgba(34,35,40,0.20)",
              borderRadius: "4px"
            },
            autocompleteItem: {
              padding: 0,
              margin: 0,
              backgroundColor: "transparent"
            },
            autocompleteItemActive: {
              backgroundColor: "transparent"
            }
          }}
          inputProps={{
            value,
            onChange: this.handleLocationChange,
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            onFocus: evt => this.setFocused(true, evt),
            onBlur: evt => this.setFocused(false, evt),
            name,
            type: "search",
            disabled,
            placeholder
          }}
        />
      );
    } else if (type === "date") {
      return (
        <DatePicker
          value={value}
          onChange={this.handleDateChange}
          focused={this.state.isFocused}
          onFocusChange={({ focused }) => this.setFocused(focused)}
        />
      );
    } else {
      return (
        <TextInput
          required={required}
          type={type}
          placeholder={placeholder}
          name={name}
          autoFocus={autoFocus}
          inline
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          value={value}
          onFocus={evt => this.setFocused(true, evt)}
          onBlur={evt => this.setFocused(false, evt)}
          inputRef={inputRef => (this.inputRef = inputRef)}
          onKeyUp={onKeyUp}
          disabled={disabled}
          className="input"
          onChange={this.handleChange}
        />
      );
    }
  };

  render() {
    const {
      icon,
      name,
      label,
      children,
      showBorder = true,
      inline
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
            "InputContainer--focused": this.state.isFocused,
            "InputContainer--bordered": showBorder
          })}
        >
          {icon && <div className="FormField-IconContainer">{icon}</div>}
          {children}

          {this.renderInput()}
        </div>

        <style jsx>{`
          fieldset {
            display: flex;
            flex-direction: column;
          }

          .FormField-IconContainer {
            margin-right: 12px;
          }

          label {
            margin-bottom: 7px;
            margin-left: ${inline ? "0px" : "22px"};
            text-align: left;
          }

          .InputContainer {
            display: flex;
            position: relative;
            flex-direction: row;
            ${!inline && "padding: 12px 22px;"} border-radius: 100px;
          }

          .InputContainer--bordered {
            border: 1px solid #e3e8f0;
          }

          .InputContainer--focused {
            border-color: #8b8f95;
          }

          fieldset :global(.LocationInput),
          fieldset :global(.LocationInputRoot),
          fieldset :global(.input) {
            display: flex;
            width: 100%;
            height: 100%;
            outline: 0;
            appearance: none;
            box-shadow: none;
            border: 0;
            font-size: 14px;
            font-weight: 400;
            font-family: Open Sans, sans-serif;
          }

          fieldset :global(.LocationInputRoot) {
            position: relative;
          }

          input::placeholder {
            color: #b9bed1;
          }
        `}</style>
      </fieldset>
    );
  }
}
