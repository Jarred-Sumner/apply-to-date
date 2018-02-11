import Text from "./Text";
import Icon from "./Icon";

export default ({ checked, name, label, onChange, required }) => {
  return (
    <React.Fragment>
      <div
        onClick={() => onChange({ target: { name, checked: !checked } })}
        className="Container"
      >
        <div className="CheckboxContainer">
          <input
            type="checkbox"
            required={required}
            name={name}
            checked={checked}
            onChange={onChange}
          />

          <div className="Icon">
            {checked && <Icon type="check" color="white" size="8px" />}
          </div>
        </div>
        {label && (
          <label htmlFor={name}>
            <Text color="#3A405B" size="13px" lineHeight="18px">
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
          align-items: center;
          align-content: center;
          cursor: pointer;
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
          display: flex;
          margin: auto;
          align-items: center;
          justify-content: center;
          align-content: center;
          pointer-events: none;
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
        }

        input:checked {
          border: 2px solid transparent;
          background-color: #00e2aa;
        }
      `}</style>
    </React.Fragment>
  );
};
