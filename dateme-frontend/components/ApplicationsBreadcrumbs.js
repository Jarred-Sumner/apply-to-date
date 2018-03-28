import BreadcrumbLink from "./BreadcrumbLink";

export default class ApplicationsBreadcrumbs extends React.Component {
  render() {
    return (
      <nav>
        <BreadcrumbLink prefetch href="/applications">
          {this.props.newApplicationsCount > 0
            ? `New (${this.props.newApplicationsCount})`
            : `New`}
        </BreadcrumbLink>
        <BreadcrumbLink prefetch href="/matches">
          Matches
        </BreadcrumbLink>
        <BreadcrumbLink prefetch href="/applications/passed">
          Passed
        </BreadcrumbLink>
        <BreadcrumbLink prefetch href="/applications/filtered">
          Filtered
        </BreadcrumbLink>

        <style jsx>{`
          nav {
            display: grid;
            grid-auto-flow: column dense;
            grid-column-gap: 24px;
            grid-auto-columns: auto auto auto auto;
            margin-top: 48px;
            margin-bottom: 48px;
            justify-content: center;
            text-align: center;
          }
        `}</style>
      </nav>
    );
  }
}
