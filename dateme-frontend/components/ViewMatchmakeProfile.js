import AskProfileOutButton from "./AskProfileOutButton";
import Waypoint from "react-waypoint";
import PhotoGroup from "./PhotoGroup";
import Text from "./Text";
import _ from "lodash";
import Typed from "react-typed";
import titleCase from "title-case";
import Linkify from "react-linkify";
import Swipeable from "react-swipeable";
import SocialLinkList from "./SocialLinkList";
import TwitterViewer from "./TwitterViewer";
import InstagramSection from "./InstagramSection";

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
      <Text highlightId="title" type="ProfilePageTitle">
        {titleCase(profile.name)}
      </Text>
    </section>
    {!_.isEmpty(profile.socialLinks) && (
      <section className="Section Section--center Section--title">
        <SocialLinkList socialLinks={profile.socialLinks} />
      </section>
    )}

    {profile.photos.length > 0 && (
      <section className="Section">
        <PhotoGroup
          showPlaceholder={false}
          photos={profile.photos}
          circle={profile.photos.length === 1}
          max={profile.photos.length}
        />
      </section>
    )}

    {!_.isEmpty(profile.tagline) && (
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
        overflow
        marginTop="1rem"
        profileId={profile.id}
      />
    )}
    {profile.socialLinks.twitter && (
      <TwitterViewer key={`twitter-${profile.id}`} profileId={profile.id} />
    )}

    <style jsx>{`
      .Container {
        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 42px;
        padding-top: 28px;
        padding-left: 77px;
        padding-right: 77px;
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

class MobileProfile extends React.Component {
  focus = () => {
    if (this.containerRef) {
      this.containerRef.focus();
    }
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.profile &&
      this.props.profile &&
      prevProps.profile.id !== this.props.profile.id
    ) {
      this.focus();
      this.containerRef.scrollTo(0, 0);
    }
  }

  render() {
    const { profile } = this.props;

    return (
      <div
        ref={containerRef => (this.containerRef = containerRef)}
        className="ScrollContainer"
      >
        <Swipeable
          onSwipedLeft={() => this.props.onSwipe("left")}
          onSwipedRight={() => this.props.onSwipe("right")}
        >
          <div className="Container">
            <section className="Section Section--center Section--title">
              <Text highlightId="title" type="ProfilePageTitle">
                {titleCase(profile.name)}
              </Text>
            </section>

            <section className="Section Section--center Section--title">
              <SocialLinkList socialLinks={profile.socialLinks} />
            </section>

            {profile.photos.length > 0 && (
              <section className="Section">
                <PhotoGroup
                  size="300px"
                  remoteSize="380px"
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

            {!_.isEmpty(getParagraphs(profile)) && (
              <section className="Section Section--bio">
                {getParagraphs(profile).map(paragraph => {
                  return (
                    <div
                      key={paragraph.key}
                      className="Section-row Section-row--bio"
                    >
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
              <TwitterViewer
                key={`twitter-${profile.id}`}
                profileId={profile.id}
              />
            )}
          </div>
        </Swipeable>
        <style jsx>{`
          .Container {
            display: grid;
            grid-auto-flow: row;
            grid-row-gap: 14px;
            align-content: flex-start;
            padding: 14px;
            padding-bottom: 28px;
            width: 100%;
          }

          .ScrollContainer {
            overflow: auto;
            height: 100%;
            width: 100%;
            display: block;
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
  }
}

export default ({ isMobile, profileRef, profile, onSwipe }) => {
  if (isMobile) {
    return (
      <MobileProfile onSwipe={onSwipe} ref={profileRef} profile={profile} />
    );
  } else {
    return <DesktopProfile ref={profileRef} profile={profile} />;
  }
};
