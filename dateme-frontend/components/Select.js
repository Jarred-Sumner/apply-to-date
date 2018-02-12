import classNames from "classnames";
import Icon from "./Icon";
import _ from "lodash";

export default class Select extends React.Component {
  handleChange = evt => this.props.onChange(evt.target.value);

  render() {
    const { name, required, value, inline, options } = this.props;
    return (
      <div
        className={classNames("Container", {
          "Container--inline": inline,
          "Container--block": !inline
        })}
      >
        <select
          name={name}
          onChange={this.handleChange}
          required={required}
          value={value}
        >
          {_.sortBy(options, "label").map(option => (
            <option key={option.value} value={option.value}>
              {option.label || option.value}
            </option>
          ))}
        </select>
        <div className="TriangleContainer">
          <Icon type="caret" size="10px" color="rgba(0, 0, 0, 0.75)" />
        </div>

        <style jsx>{`
          select {
            appearance: none;
            box-shadow: none;
            background-color: transparent;
            width: 100%;
            outline: none;
            font-family: Open Sans, sans-serif;
            font-size: 14px;
            padding: 12px 24px;
            color: rgba(0, 0, 0, 0.75);
            border: 0;
            height: 100%;
            cursor: pointer;
          }

          .Container--block {
            border-radius: 4px;
            border: 1px solid #e3e8f0;
          }

          .Container--inline {
            border-top-left-radius: 100px;
            border-bottom-left-radius: 100px;
            border-right: 1px solid #e3e8f0;
          }

          .Container--inline select {
            padding-right: 48px;
          }

          .Container {
            display: flex;
            position: relative;
            width: max-content;
            background-color: white;
            cursor: pointer;
          }

          .Container:hover {
            background-color: #fcfcfc;
            cursor: pointer;
          }

          .TriangleContainer {
            height: 100%;
            pointer-events: none;
            right: 14px;
            margin-left: auto;
            display: flex;
            position: absolute;
            justify-content: center;
            align-items: center;
            pointer-events: none;
          }
        `}</style>
      </div>
    );
  }
}
