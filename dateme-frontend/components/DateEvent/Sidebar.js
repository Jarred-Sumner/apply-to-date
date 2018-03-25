import { COLORS, SPACING } from "../../helpers/styles";
import Text from "../Text";
import SidebarCard from "./SidebarCard";
import CreateDateEventModal from "./CreateModal";
import Button from "../Button";
import Icon from "../Icon";
import Divider from "../Divider";
import { buildDateEventURL } from "../../lib/routeHelpers";
import SidebarContainer, { SidebarHeader } from "../Sidebar";

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
    const {
      upcomingDateEventApplications,
      dateEvents,
      upcomingDateEvents
    } = this.props;
    const { showCreateModal } = this.state;

    return (
      <SidebarContainer>
        <div className="ButtonContainer">
          <Button onClick={this.showCreateModal} fill color="blue">
            New date
          </Button>
        </div>

        {upcomingDateEventApplications.length > 0 && (
          <React.Fragment>
            <SidebarHeader>Your upcoming dates</SidebarHeader>
            {upcomingDateEventApplications.map(
              ({ dateEvent, profile }, index) => (
                <SidebarCard
                  href={buildDateEventURL(dateEvent.id)}
                  dateEvent={dateEvent}
                  profile={profile}
                  key={dateEvent.id}
                  isLast={index === upcomingDateEventApplications.length - 1}
                />
              )
            )}
          </React.Fragment>
        )}

        {upcomingDateEvents.length > 0 && (
          <React.Fragment>
            <SidebarHeader>Upcoming dates</SidebarHeader>
            {upcomingDateEvents.map(({ dateEvent, profile }, index) => (
              <SidebarCard
                href={buildDateEventURL(dateEvent.id)}
                dateEvent={dateEvent}
                profile={profile}
                key={dateEvent.id}
                isLast={index === upcomingDateEvents.length - 1}
              />
            ))}
          </React.Fragment>
        )}

        {dateEvents.length > 0 && (
          <React.Fragment>
            <SidebarHeader>Dates in bay area</SidebarHeader>
            {dateEvents.map(({ dateEvent, profile }, index) => (
              <SidebarCard
                href={buildDateEventURL(dateEvent.id)}
                dateEvent={dateEvent}
                profile={profile}
                key={dateEvent.id}
                isLast={index === dateEvents.length - 1}
              />
            ))}
          </React.Fragment>
        )}

        <CreateDateEventModal
          open={showCreateModal}
          region={this.props.region}
          onHide={this.hideCreateModal}
        />

        <style jsx>{`
          .ButtonContainer {
            display: flex;
            justify-content: center;
            flex-direction: column;
            margin: ${SPACING.NORMAL}px;
          }
        `}</style>
      </SidebarContainer>
    );
  }
}

export default Sidebar;
