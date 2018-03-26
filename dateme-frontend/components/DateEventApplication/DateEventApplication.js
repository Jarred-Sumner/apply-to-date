import { COLORS, SPACING } from "../../helpers/styles";
import Text from "../Text";
import Waypoint from "react-waypoint";
import PhotoGroup from "../PhotoGroup";
import _ from "lodash";
import Typed from "react-typed";
import titleCase from "title-case";
import Linkify from "react-linkify";
import SocialLinkList from "../SocialLinkList";
import TwitterViewer from "../TwitterViewer";
import InstagramSection from "../InstagramSection";
import Button from "../Button";
import { LABELS_BY_CATEGORY, EMOJI_BY_CATEGORY } from "../../helpers/dateEvent";

const SECTION_ORDERING = [
  "why",
  "introduction",
  "background",
  "looking-for",
  "not-looking-for"
];

const SECTION_LABELS = {
  why: "Why I want to go on a date with you",
  introduction: "Introduction",
  background: "Background",
  "looking-for": "Looking for",
  "not-looking-for": "Not looking for"
};

const getParagraphs = dateEventApplication => {
  const { sections } = dateEventApplication;

  const filledSections = _.keys(sections).filter(key => !!sections[key]);

  return _.sortBy(filledSections, key => SECTION_ORDERING.indexOf(key)).map(
    section => ({
      key: section,
      title: SECTION_LABELS[section],
      body: sections[section]
    })
  );
};

export default ({
  dateEventApplication,
  dateEvent,
  isMobile,
  onScrollEnterAskButton,
  onScrollLeaveAskButton
}) => (
  <React.Fragment>
    <section className="Section Section--center Section--title">
      <div className="Section-row">
        <Text highlightId="title" type="ProfilePageTitle">
          👋 &nbsp; Hi, I'm {titleCase(dateEventApplication.name)}.
        </Text>
      </div>

      <div className="Section-row">
        <Text highlightId="tagline" type="Tagline">
          <Linkify
            properties={{
              target: "_blank",
              className: "LinkifyLink"
            }}
          >
            {dateEventApplication.tagline}
          </Linkify>
        </Text>
      </div>

      <SocialLinkList socialLinks={dateEventApplication.socialLinks} />
    </section>

    <section className="Section">
      <PhotoGroup
        size="206px"
        remoteSize="380px"
        showPlaceholder={false}
        photos={dateEventApplication.photos}
      />
    </section>
    {!_.isEmpty(getParagraphs(dateEventApplication)) && (
      <section className="Section Section--bio">
        {getParagraphs(dateEventApplication).map(paragraph => {
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
    )}

    {dateEventApplication.socialLinks.instagram && (
      <InstagramSection
        key={`instagram-${dateEventApplication.id}`}
        dateEventApplicationId={dateEventApplication.id}
      />
    )}
    {dateEventApplication.socialLinks.twitter && (
      <TwitterViewer
        key={`twitter-${dateEventApplication.id}`}
        dateEventApplicationId={dateEventApplication.id}
      />
    )}
    <style jsx>{`
      .Section {
        margin-top: 4rem;

        display: grid;
        align-content: flex-start;
        grid-row-gap: 2rem;
        max-width: 100%;
      }

      .HeaderForm {
        margin-left: auto;
        margin-right: auto;
        width: 50%;
      }

      .Section-row {
        width: 100%;
      }

      .Tags {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
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
  </React.Fragment>
);
