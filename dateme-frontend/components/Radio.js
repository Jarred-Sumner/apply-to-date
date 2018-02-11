import Text from "./Text";
import Icon from "./Icon";
import classNames from "classnames";

export default ({ value, name, label, selected, checked, onChange }) => {
  return (
    <React.Fragment>
      <div
        onClick={() => onChange({ target: { value } })}
        className="Container"
      >
        <div className="RadioContainer">
          <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
          />

          <div
            className={classNames("Icon", {
              "Icon--visible": selected
            })}
          >
            <div className="Circle" />
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

        .RadioContainer {
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
          height: 100%;
          width: 100%;
          align-items: center;
          justify-content: center;
          align-content: center;
          pointer-events: none;
          transform: scale(0);
          transition: transform 0.1s linear;
        }

        .Icon--visible {
          transform: scale(1);
        }

        .Circle {
          background-color: #4be1ab;
          border-radius: 50%;
          height: 100%;
          width: 100%;
          display: block;
          content: "";
        }

        input {
          border: 2px solid #e4e7ef;
          border-radius: 50%;
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
      `}</style>
    </React.Fragment>
  );
};
