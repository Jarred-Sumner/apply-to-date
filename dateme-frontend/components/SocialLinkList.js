import SocialLink from "./SocialLink";
import _ from "lodash";
import classNames from "classnames";

export default ({ socialLinks, centered = true }) => (
  <section className={classNames({ "Section--centered": centered })}>
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
        grid-auto-flow: column;
        grid-column-gap: 32px;
        justify-content: flex-start;
      }

      .Section--centered {
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
      }
    `}</style>
  </section>
);
