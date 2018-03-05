import AskProfileOutButton from "./AskProfileOutButton";
import Waypoint from "react-waypoint";
import PhotoGroup from "./PhotoGroup";
import Text from "./Text";
import _ from "lodash";
import Typed from "react-typed";
import titleCase from "title-case";
import Linkify from "react-linkify";
import SocialLinkList from "./SocialLinkList";
import TwitterViewer from "./TwitterViewer";
import InstagramSection from "./InstagramSection";
import Tag from "./Tag";

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

export default ({
  profile,
  isMobile,
  onScrollEnterAskButton,
  onScrollLeaveAskButton
}) => (
  <React.Fragment>
    <section className="Section Section--center Section--title">
      {profile.photos.length === 1 && (
        <div className="Section-row Section-row--centered">
          <PhotoGroup
            size="192px"
            showPlaceholder={false}
            photos={profile.photos}
            remoteSize={"380px"}
            circle
            max={1}
          />
        </div>
      )}

      <div className="Section-row">
        <Text highlightId="title" type="ProfilePageTitle">
          👋 &nbsp;
          <Typed
            strings={[
              `Hi, I'm ${titleCase(profile.name)}.`,
              "We should meet.",
              "Leave me a note."
            ]}
            typeSpeed={60}
            backSpeed={30}
            backDelay={4000}
            loop={true}
          />
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
            {profile.tagline}
          </Linkify>
        </Text>

        {profile.location && (
          <div className="Tags">
            <Tag color="blue">{profile.location}</Tag>
          </div>
        )}
      </div>

      <SocialLinkList socialLinks={profile.socialLinks} />
      <Waypoint
        onEnter={onScrollEnterAskButton}
        onLeave={onScrollLeaveAskButton}
      >
        <div className="Section-row ApplicationForm">
          <AskProfileOutButton profile={profile} />
        </div>
      </Waypoint>
    </section>
    {profile.photos.length > 1 && (
      <section className="Section">
        <PhotoGroup
          size="206px"
          remoteSize="380px"
          showPlaceholder={false}
          photos={profile.photos}
        />
      </section>
    )}
    {!_.isEmpty(getParagraphs(profile)) && (
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
    )}

    {profile.socialLinks.instagram && (
      <InstagramSection
        key={`instagram-${profile.id}`}
        profileId={profile.id}
      />
    )}
    {profile.socialLinks.twitter && (
      <TwitterViewer key={`twitter-${profile.id}`} profileId={profile.id} />
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
