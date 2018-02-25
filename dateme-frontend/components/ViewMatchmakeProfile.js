import AskProfileOutButton from "./AskProfileOutButton";
import Waypoint from "react-waypoint";
import PhotoGroup from "./PhotoGroup";
import Text from "./Text";
import _ from "lodash";
import Typed from "react-typed";
import titleCase from "title-case";
import Linkify from "react-linkify";
import SocialLinkList from "./SocialLinkList";

const SECTION_ORDERING = [
  "introduction",
  "background",
  "looking-for",
  "not-looking-for"
];

const SECTION_LABELS = {
  introduction: "Introduction",
  background: "Background",
  "looking-for": "Looking for",
  "not-looking-for": "Not looking for"
};

const getParagraphs = profile => {
  const { sections } = profile;

  const filledSections = _.keys(sections).filter(key => !!sections[key]);

  return _.sortBy(filledSections, key => SECTION_ORDERING.indexOf(key)).map(
    section => ({
      key: section,
      title: SECTION_LABELS[section],
      body: sections[section]
    })
  );
};

const DesktopProfile = ({ profile }) => (
  <div className="Container">
    <section className="Section Section--center Section--title">
      <SocialLinkList socialLinks={profile.socialLinks} />
    </section>

    {profile.photos.length > 0 && (
      <section className="Section">
        <PhotoGroup
          size="100px"
          showPlaceholder={false}
          photos={profile.photos}
          circle={profile.photos.length === 1}
          max={profile.photos.length}
        />
      </section>
    )}

    <section className="Section Section--bio Section--center">
      <div className="Section-row">
        <Text highlightId="tagline" type="Tagline">
          <Linkify
            properties={{
              target: "_blank",
              className: "LinkifyLink"
            }}
          >
            {profile.tagline}
          </Linkify>
        </Text>
      </div>
    </section>

    <section className="Section Section--bio">
      {getParagraphs(profile).map(paragraph => {
        return (
          <div key={paragraph.key} className="Section-row Section-row--bio">
            <Text className="Section-title" type="title">
              {paragraph.title}
            </Text>

            <Text highlightId={paragraph.key} type="paragraph">
              <Linkify
                properties={{
                  target: "_blank",
                  className: "LinkifyLink"
                }}
              >
                {paragraph.body}
              </Linkify>
            </Text>
          </div>
        );
      })}
    </section>
    <style jsx>{`
      .Container {
        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 14px;
        padding: 14px;
      }

      .Section {
        display: grid;
        grid-row-gap: 7px;
        width: 100%;
      }

      .HeaderForm {
        margin-left: auto;
        margin-right: auto;
        width: 50%;
      }

      .Section-row {
        width: 100%;
      }

      .Section-title {
        margin-bottom: 14px;
      }

      .Section-tagline {
        font-size: 18px;
      }

      .Section-row--bio {
        display: grid;
        grid-row-gap: 1rem;
      }

      .Section--row--center {
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
      }

      .Section--center {
        text-align: center;
      }

      .ApplicationForm {
        max-width: max-content;
        margin-left: auto;
        margin-right: auto;
      }
    `}</style>
  </div>
);

const MobileProfile = ({ profile }) => (
  <div className="Container">
    <section className="Section Section--center Section--title">
      <SocialLinkList socialLinks={profile.socialLinks} />
    </section>

    {profile.photos.length > 0 && (
      <section className="Section">
        <PhotoGroup
          size="300px"
          showPlaceholder={false}
          photos={profile.photos}
          circle={profile.photos.length === 1}
          max={profile.photos.length}
        />
      </section>
    )}

    <section className="Section Section--bio Section--center">
      <div className="Section-row">
        <Text highlightId="tagline" type="Tagline">
          <Linkify
            properties={{
              target: "_blank",
              className: "LinkifyLink"
            }}
          >
            {profile.tagline}
          </Linkify>
        </Text>
      </div>
    </section>

    <section className="Section Section--bio">
      {getParagraphs(profile).map(paragraph => {
        return (
          <div key={paragraph.key} className="Section-row Section-row--bio">
            <Text className="Section-title" type="title">
              {paragraph.title}
            </Text>

            <Text highlightId={paragraph.key} type="paragraph">
              <Linkify
                properties={{
                  target: "_blank",
                  className: "LinkifyLink"
                }}
              >
                {paragraph.body}
              </Linkify>
            </Text>
          </div>
        );
      })}
    </section>
    <style jsx>{`
      .Container {
        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 14px;
        padding: 14px;
        padding-bottom: 200px;
      }

      .Section {
        display: grid;
        grid-row-gap: 7px;
        width: 100%;
      }

      .HeaderForm {
        margin-left: auto;
        margin-right: auto;
        width: 50%;
      }

      .Section-row {
        width: 100%;
      }

      .Section-title {
        margin-bottom: 14px;
      }

      .Section-tagline {
        font-size: 18px;
      }

      .Section-row--bio {
        display: grid;
        grid-row-gap: 1rem;
      }

      .Section--row--center {
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
      }

      .Section--center {
        text-align: center;
      }

      .ApplicationForm {
        max-width: max-content;
        margin-left: auto;
        margin-right: auto;
      }
    `}</style>
  </div>
);

export default ({ isMobile, profile }) => {
  if (isMobile) {
    return <MobileProfile profile={profile} />;
  } else {
    return <DesktopProfile profile={profile} />;
  }
};
