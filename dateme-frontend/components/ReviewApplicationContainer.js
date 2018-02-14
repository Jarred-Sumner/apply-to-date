import Page from "../components/Page";
import ViewApplication from "./ViewApplication";
import RateApplication from "./RateApplication";
import Head from "./head";
import Text from "./Text";

export default ({ application, isLoading, onYes, onNo }) => (
  <Page isLoading={isLoading} size="small">
    <Head title="Review Application | AskToMeet" />

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
        margin-top: 6rem;
        margin-bottom: 3rem;
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
