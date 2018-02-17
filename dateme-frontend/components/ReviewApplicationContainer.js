import Page from "../components/Page";
import ViewApplication from "./ViewApplication";
import RateApplication from "./RateApplication";
import Head from "./head";
import Text from "./Text";
import ApplicationsBreadcrumbs from "./ApplicationsBreadcrumbs";
import InlineTextForm from "./InlineTextForm";
import copy from "copy-to-clipboard";

const EmptyState = ({ profileId }) => (
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

    <InlineTextForm
      type="url"
      value={`${process.env.DOMAIN}/${profileId}`}
      readOnly
      onSubmit={() => copy(`${process.env.DOMAIN}/${profileId}`)}
      buttonChildren={"Copy URL"}
    />

    <style jsx>{`
      .Container {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-row-gap: 14px;
        justify-content: center;
        text-align: center;
      }
    `}</style>
  </div>
);

export default ({ application, isLoading, onYes, onNo, currentUser }) => (
  <Page isLoading={isLoading}>
    <Head title="Review Application | Apply to date" />

    <ApplicationsBreadcrumbs />

    {application && (
      <article>
        <RateApplication onYes={onYes} onNo={onNo} name={application.name} />
        <ViewApplication application={application} />
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
    `}</style>
  </Page>
);
