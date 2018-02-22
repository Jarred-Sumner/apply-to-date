import Text from "./Text";
import Icon from "./Icon";
import classNames from "classnames";

const SIZE_TO_PX = {
  large: "14px",
  default: "13px",
  small: "11px"
};

export default ({
  checked,
  name,
  label,
  onChange,
  required,
  size = "default",
  align = "center",
  disabled
}) => {
  return (
    <React.Fragment>
      <div
        onClick={() =>
          onChange && onChange({ target: { name, checked: !checked } })
        }
        className="Container"
      >
        <div className="CheckboxContainer">
          <input
            type="checkbox"
            required={required}
            name={name}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
          />

          <div className="Icon">
            {checked && <Icon type="check" color="white" size="8px" />}
          </div>
        </div>
        {label && (
          <label htmlFor={name}>
            <Text
              align={align}
              color="#3A405B"
              size={SIZE_TO_PX[size]}
              lineHeight="18px"
            >
              {label}
            </Text>
          </label>
        )}
      </div>
      <style jsx>{`
        .Container {
          display: grid;
          grid-auto-flow: column dense;
          grid-column-gap: 8px;
          align-items: ${align};
          align-content: ${align};
          cursor: pointer;
          width: max-content;
        }

        label {
          cursor: pointer;
        }

        .CheckboxContainer {
          position: relative;
          align-items: center;
          display: flex;
        }

        .Icon {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          align-content: center;
          pointer-events: none;
          flex: 0 0 auto;
        }

        input {
          border: 2px solid #e4e7ef;
          border-radius: 4px;
          background-color: transparent;
          appearance: none;
          box-shadow: none;
          outline: 0;
          height: 20px;
          margin: 0;
          padding: 0;
          cursor: pointer;
          width: 20px;
          flex: 0 0 auto;
        }

        input:checked {
          border: 2px solid transparent;
          background-color: #00e2aa;
        }
      `}</style>
    </React.Fragment>
  );
};
