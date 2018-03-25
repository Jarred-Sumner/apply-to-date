import { COLORS, SPACING } from "../../helpers/styles";
import Text from "../Text";
import SidebarCard from "./SidebarCard";
import Button from "../Button";
import Icon from "../Icon";
import Divider from "../Divider";
import {
  buildDateEventURL,
  buildCreatorDateEventApplicationURL
} from "../../lib/routeHelpers";
import SidebarContainer, { SidebarHeader } from "../Sidebar";
import { formatTitle } from "../../helpers/dateEvent";
import { Link } from "../../routes";

class Sidebar extends React.Component {
  state = {
    showCreateModal: false
  };

  hideCreateModal = () => {
    this.setState({
      showCreateModal: false
    });
  };

  showCreateModal = () => this.setState({ showCreateModal: true });

  render() {
    const { dateEvent, dateEventApplications = [] } = this.props;

    return (
      <SidebarContainer>
        <Link route={buildDateEventURL(dateEvent.id)}>
          <a>
            <SidebarHeader
              icon={
                <Icon
                  type="caret-right"
                  width="12px"
                  rotate="180deg"
                  height="12px"
                  color={COLORS.DARK_GRAY}
                />
              }
            >
              {formatTitle({
                profile: dateEvent.profile,
                category: dateEvent.category
              })}
            </SidebarHeader>
          </a>
        </Link>

        {dateEventApplications.map((dateEventApplication, index) => (
          <SidebarCard
            href={buildCreatorDateEventApplicationURL(
              dateEventApplication.id,
              dateEvent.id
            )}
            dateEventApplication={dateEventApplication}
            key={dateEventApplication.id}
            isLast={index === dateEventApplications.length - 1}
          />
        ))}
      </SidebarContainer>
    );
  }
}

export default Sidebar;
