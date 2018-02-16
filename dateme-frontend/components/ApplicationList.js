import ApplicationListItem from "./ApplicationListItem";

export default class ApplicationList extends React.PureComponent {
  render() {
    const { applications } = this.props;
    return (
      <div className="ApplicationList">
        {applications.map(application => (
          <ApplicationListItem application={application} key={application.id} />
        ))}

        <style jsx>{`
          .ApplicationList {
            display: grid;
            grid-auto-flow: row;
            grid-row-gap: 28px;
          }
        `}</style>
      </div>
    );
  }
}
