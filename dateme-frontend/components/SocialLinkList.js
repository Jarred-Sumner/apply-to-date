import SocialLink from "./SocialLink";
import _ from "lodash";
export default ({ socialLinks }) => (
  <section>
    {_.map(
      socialLinks,
      (url, provider) =>
        url && (
          <SocialLink provider={provider} url={url} key={provider} active />
        )
    )}
    <style jsx>{`
      section {
        display: grid;
        justify-content: center;
        margin-left: auto;
        padding-left: 18px;
        padding-right: 18px;
        margin-right: auto;
        grid-auto-flow: column;
        grid-column-gap: 32px;
      }
    `}</style>
  </section>
);
