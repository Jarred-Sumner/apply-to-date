import BreadcrumbLink from "./BreadcrumbLink";

export default class ApplicationsBreadcrumbs extends React.Component {
  render() {
    return (
      <nav>
        <BreadcrumbLink href="/applications">New</BreadcrumbLink>
        <BreadcrumbLink href="/applications/liked">Liked</BreadcrumbLink>
        <BreadcrumbLink href="/applications/passed">Passed</BreadcrumbLink>

        <style jsx>{`
          nav {
            display: grid;
            grid-auto-flow: column dense;
            grid-column-gap: 24px;
            grid-auto-columns: min-content min-content min-content;
            margin-top: 24px;
            margin-bottom: 24px;
            justify-content: center;
            text-align: center;
          }
        `}</style>
      </nav>
    );
  }
}
