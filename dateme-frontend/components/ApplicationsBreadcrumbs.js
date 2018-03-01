import BreadcrumbLink from "./BreadcrumbLink";

export default class ApplicationsBreadcrumbs extends React.Component {
  render() {
    return (
      <nav>
        <BreadcrumbLink prefetch href="/applications">
          New
        </BreadcrumbLink>
        <BreadcrumbLink prefetch href="/applications/liked">
          Liked
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
            grid-auto-columns: min-content min-content min-content min-content;
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
