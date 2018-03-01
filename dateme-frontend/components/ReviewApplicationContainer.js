import Page from "../components/Page";
import ViewApplication from "./ViewApplication";
import RateApplication from "./RateApplication";
import Head from "./head";
import Text from "./Text";
import ApplicationsBreadcrumbs from "./ApplicationsBreadcrumbs";
import SharableSocialLink from "./SharableSocialLink";
import CopyURLForm from "./CopyURLForm";

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

      <div className="URLForm">
        <CopyURLForm url={url} />
        <Text size="14px">
          Tip: link to your page in your Instagram and Tinder bio
        </Text>
      </div>

      <div className="ShareButtons">
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
          grid-template-rows: auto auto auto auto;
          grid-row-gap: 28px;
          padding-left: 14px;
          padding-right: 14px;
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

        .URLForm {
          grid-auto-flow: row;
          grid-row-gap: 14px;
        }
      `}</style>
    </div>
  );
};

export default ({
  application,
  isLoading,
  onYes,
  onNo,
  currentUser,
  isMobile
}) => (
  <Page size="large" isLoading={isLoading}>
    <Head title="Review Application | Apply to date" />

    <ApplicationsBreadcrumbs />

    {application && (
      <article>
        <RateApplication
          onYes={onYes}
          onNo={onNo}
          name={application.name}
          isMobile={isMobile}
        />
        <ViewApplication application={application} isMobile={isMobile} />
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
