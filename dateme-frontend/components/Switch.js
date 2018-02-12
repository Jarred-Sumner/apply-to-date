import ExternalSwitch from "rc-switch";
import Icon from "./Icon";
import Text from "./Text";

const OFF_COLOR = "#F45138";
const ON_COLOR = "#4BE1AB";

export default class Switch extends React.Component {
  render() {
    const { checked, onChange, children, ...otherProps } = this.props;

    return (
      <div className="SwitchContainer">
        <ExternalSwitch
          {...otherProps}
          prefixCls="Switch"
          checked={checked}
          onChange={onChange}
          checkedChildren={
            <div className="IconContainer">
              <Icon type="switch-on" size="10px" color="#3CB489" />
            </div>
          }
          unCheckedChildren={
            <div className="IconContainer">
              <Icon type="switch-off" size="10px" color="#CB422E" />
            </div>
          }
        />

        <Text
          color={checked ? ON_COLOR : OFF_COLOR}
          weight="bold"
          casing="uppercase"
          size="12px"
          lineHeight="17px"
        >
          {children}
        </Text>

        <style jsx global>{`
          .SwitchContainer {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 12px;
            align-items: center;
          }

          .SwitchContainer .IconContainer {
            margin-top: auto;
            margin-bottom: auto;
            height: 100%;
          }

          .Switch {
            position: relative;
            display: inline-block;
            box-sizing: border-box;
            width: 44px;
            background-color: #fe5339;
            height: 22px;
            line-height: 20px;
            vertical-align: middle;
            border-radius: 20px 20px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.35, 0, 0.25, 1);
          }
          .Switch-inner {
            color: #fff;
            font-size: 12px;
            position: absolute;
            left: 24px;
            height: 100%;
          }
          .Switch:after {
            position: absolute;
            width: 18px;
            height: 18px;
            left: 2px;
            top: 1px;
            border-radius: 50% 50%;
            background-color: #fff;
            content: " ";
            cursor: pointer;
            box-shadow: 0 10px 25px 0 rgba(34, 35, 40, 0.4);
            transform: scale(1);
            transition: left 0.3s cubic-bezier(0.35, 0, 0.25, 1);
            animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);
            animation-duration: 0.3s;
            animation-name: rcSwitchOff;
          }
          .Switch:hover:after {
            transform: scale(1.1);
            animation-name: rcSwitchOn;
          }
          .Switch:focus {
            box-shadow: 0 0 0 2px #d5f1fd;
            outline: none;
          }
          .Switch-checked {
            background-color: #47d6a3;
          }
          .Switch-checked .Switch-inner {
            left: 6px;
          }
          .Switch-checked:after {
            left: 22px;
          }
          .Switch-disabled {
            cursor: no-drop;
            opacity: 0.75;
          }
          .Switch-disabled:after {
            animation-name: none;
            cursor: no-drop;
          }
          .Switch-disabled:hover:after {
            transform: scale(1);
            animation-name: none;
          }
          .Switch-label {
            display: inline-block;
            line-height: 20px;
            font-size: 14px;
            padding-left: 10px;
            vertical-align: middle;
            white-space: normal;
            pointer-events: none;
            user-select: text;
          }
          @keyframes rcSwitchOn {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1.05);
            }
          }
          @keyframes rcSwitchOff {
            0% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  }
}
