import Page from "../components/Page";
import ViewApplication from "./ViewApplication";
import RateApplication from "./RateApplication";
import Head from "./head";
import Text from "./Text";
import ApplicationsBreadcrumbs from "./ApplicationsBreadcrumbs";
import SharableSocialLink from "./SharableSocialLink";
import CopyURLForm from "./CopyURLForm";
import { isMobile } from "../lib/Mobile";

const EmptyState = ({ profileId }) => {
  const url = `${process.env.DOMAIN}/${profileId}`;
  return (
    <div className="Container">
      <div className="Title">
        <Text align="center" type="title">
          You have no new applications.
        </Text>
      </div>
      <div className="Share">
        <Text align="center" type="subtitle">
          Share your page to meet interesting people.
        </Text>
      </div>

      <CopyURLForm url={url} />

      <div>
        <SharableSocialLink
          provider="twitter"
          width="48px"
          height="48px"
          url={url}
        />

        <SharableSocialLink
          provider="facebook"
          width="48px"
          height="48px"
          url={url}
        />
      </div>
      <style jsx>{`
        .Container {
          display: grid;
          grid-template-rows: 1fr 1fr 1fr 1fr;
          grid-row-gap: 28px;
          justify-content: center;
          text-align: center;
        }

        div {
          display: grid;
          margin-left: auto;
          grid-auto-flow: column;
          grid-column-gap: 28px;
          justify-content: space-around;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default ({ application, isLoading, onYes, onNo, currentUser }) => (
  <Page size="large" isLoading={isLoading}>
    <Head title="Review Application | Apply to date" />

    <ApplicationsBreadcrumbs />

    {application && (
      <article>
        <RateApplication
          onYes={onYes}
          onNo={onNo}
          name={application.name}
          isMobile={isMobile()}
        />
        <ViewApplication application={application} isMobile={isMobile()} />
      </article>
    )}

    {!isLoading &&
      !application &&
      currentUser && (
        <article>
          <EmptyState profileId={currentUser.username} />
        </article>
      )}

    <style jsx>{`
      article {
        margin-top: 24px;
        width: 100%;
        display: grid;
        grid-auto-flow: column;
        grid-column-gap: 24px;
        justify-content: center;
      }

      div {
        width: 100%;
        text-align: center;
      }

      @media (max-width: 500px) {
        article {
          display: block;
        }
      }
    `}</style>
  </Page>
);
