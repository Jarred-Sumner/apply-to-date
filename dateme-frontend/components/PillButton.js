import { BORDER_RADIUS, COLORS, SPACING } from "../helpers/styles";
import Text from "./Text";
import { defaultProps } from "recompose";
import classNames from "classnames";

const SelectedText = defaultProps({
  color: "inherit",
  size: "14px",
  lineHeight: "17px",
  animated: true,
  wrap: false,
  font: "sans-serif"
})(Text);

const UnselectedText = defaultProps({
  color: "inherit",
  size: "14px",
  lineHeight: "17px",
  animated: true,
  wrap: false,
  font: "sans-serif"
})(Text);

export default class PillButton extends React.Component {
  render() {
    const { children, onClick, selected = false, value, onChange } = this.props;
    const TextComponent = selected ? SelectedText : UnselectedText;

    return (
      <div
        onClick={() => onChange(value)}
        className={classNames("PillButton", {
          "PillButton--selected": selected === true,
          "PillButton--unselected": !selected
        })}
      >
        <TextComponent>{children}</TextComponent>

        <style jsx>{`
          .PillButton {
            padding: ${SPACING.SMALL}px ${SPACING.NORMAL}px;
            display: flex;
            border-radius: ${BORDER_RADIUS.OVAL}px;
            cursor: pointer;
          }

          .PillButton--unselected {
            background-color: ${COLORS.GRAY};
            color: ${COLORS.DARK_GRAY};
          }

          .PillButton--selected,
          .PillButton--unselected:hover {
            background-color: ${COLORS.BLUE};
            color: ${COLORS.WHITE};
          }
        `}</style>
      </div>
    );
  }
}
