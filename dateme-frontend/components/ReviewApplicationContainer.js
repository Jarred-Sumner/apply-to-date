import Page from "../components/Page";
import ViewApplication from "./ViewApplication";
import RateApplication from "./RateApplication";
import Head from "./head";
import Text from "./Text";
import ApplicationsBreadcrumbs from "./ApplicationsBreadcrumbs";

export default ({ application, isLoading, onYes, onNo }) => (
  <Page isLoading={isLoading}>
    <Head title="Review Application | AskToMeet" />

    <ApplicationsBreadcrumbs />

    {application && (
      <article>
        <RateApplication onYes={onYes} onNo={onNo} name={application.name} />
        <ViewApplication application={application} />
      </article>
    )}

    {!isLoading &&
      !application && (
        <article>
          <div>
            <Text align="center" type="title">
              No more meeting requests
            </Text>
          </div>
          <div>
            <Text align="center" type="subtitle">
              Share your page on Twitter and Instagram to get more people
              writing in.
            </Text>
          </div>
        </article>
      )}

    <style jsx>{`
      article {
        margin-top: 24px;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        position: relative;
      }

      div {
        width: 100%;
        text-align: center;
      }
    `}</style>
  </Page>
);
