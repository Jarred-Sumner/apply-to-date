import Text from "./Text";
import { COLORS, SPACING } from "../helpers/styles";
import Divider from "./Divider";

const SIDEBAR_WIDTH = 250;

export const SidebarHeader = ({ children, icon }) => (
  <div className="SectionHeader">
    {icon && (
      <React.Fragment>
        {icon}
        <Divider width={`${SPACING.NORMAL}px`} color="transparent" />
      </React.Fragment>
    )}

    <Text
      align="center"
      size="12px"
      wrap={false}
      weight="bold"
      casing="uppercase"
      inline
    >
      {children}
    </Text>
    <style jsx>{`
      .SectionHeader {
        background-color: ${COLORS.GRAY};
        padding: ${SPACING.NORMAL}px;
        display: flex;
        align-items: center;
        flex: 0;
      }
    `}</style>
  </div>
);

export class Sidebar extends React.Component {
  render() {
    const { children, width = SIDEBAR_WIDTH } = this.props;

    return (
      <div className="Container">
        {children}

        <style jsx>{`
          .Container {
            display: grid;
            grid-auto-flow: row dense;
            grid-auto-rows: min-content;

            width: ${width}px;
            flex: 0 0 ${width}px;
            background-color: ${COLORS.WHITE};
            filter: drop-shadow(3px 0 4px ${COLORS.LIGHT_SHADOW});
            overflow-y: auto;
          }
        `}</style>
      </div>
    );
  }
}

Sidebar.Header = SidebarHeader;

export default Sidebar;
