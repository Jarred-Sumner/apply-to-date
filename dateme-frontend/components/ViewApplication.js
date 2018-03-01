import Thumbnail from "./Thumbnail";
import Text from "./Text";
import _ from "lodash";
import { SECTION_ORDERING, SECTION_LABELS } from "../pages/CreateApplication";
import SocialLinkList from "./SocialLinkList";
import PhotoGroup from "./PhotoGroup";
import InstagramSection from "./InstagramSection";
import TwitterViewer from "./TwitterViewer";
import classNames from "classnames";

export default class ViewApplication extends React.Component {
  paragraphs = () => {
    const { sections } = this.props.application;

    const filledSections = _.keys(sections).filter(key => !!sections[key]);

    return _.sortBy(filledSections, key => SECTION_ORDERING.indexOf(key)).map(
      section => ({
        title: SECTION_LABELS[section],
        body: sections[section]
      })
    );
  };

  render() {
    const { isMobile, application } = this.props;
    const { photos, name, tagline, socialLinks, sections } = application;

    return (
      <section
        className={classNames("ViewApplication", {
          "ViewApplication--mobile": !!isMobile,
          "ViewApplication--desktop": !isMobile
        })}
      >
        <div className="Title">
          <Text
            size={isMobile ? "18px" : "14px"}
            lineHeight={isMobile ? "24px" : "14px"}
            weight="bold"
          >
            {name}
          </Text>

          {isMobile && (
            <div className="SocialLinks">
              <SocialLinkList centered={false} socialLinks={socialLinks} />
            </div>
          )}
        </div>

        <PhotoGroup
          size={isMobile ? "calc(100vw - 30px)" : "141px"}
          photos={photos}
          max={isMobile && _.isEmpty(photos) ? 1 : 3}
        />

        {!isMobile && (
          <div className="SocialLinks">
            <SocialLinkList centered={false} socialLinks={socialLinks} />
          </div>
        )}

        {!_.isEmpty(this.paragraphs()) && (
          <div className="Bio">
            {this.paragraphs().map(paragraph => {
              return (
                <div
                  key={paragraph.title}
                  className="Section-row Section-row--bio"
                >
                  <Text className="Section-title" type="title">
                    {paragraph.title}
                  </Text>
                  <Text type="paragraph">{paragraph.body}</Text>
                </div>
              );
            })}
          </div>
        )}

        {application.socialLinks.instagram && (
          <InstagramSection applicationId={application.id} />
        )}
        {application.socialLinks.twitter && (
          <TwitterViewer applicationId={application.id} />
        )}

        <style jsx>{`
          .ViewApplication {
            display: grid;
            grid-auto-flow: row;
            width: 100%;
            background-color: white;
          }

          .ViewApplication--desktop {
            grid-row-gap: 28px;
            padding: 28px 50px;
            border: 1px solid #e8edf3;
            border-radius: 4px;
          }

          .ViewApplication--mobile {
            display: grid;
            grid-row-gap: 14px;
          }

          .ViewApplication--mobile :global(.photo) {
            margin-top: 0;
          }

          .ViewApplication--desktop .SocialLinks {
            text-align: left;
          }

          .ViewApplication--mobile .SocialLinks {
            margin-left: auto;
          }

          .Title {
            display: flex;
            width: 100%;
            align-items: center;
          }

          .Section-row {
            display: grid;
            grid-auto-flow: row;
            grid-row-gap: 14px;
            width: 100%;
          }

          .Bio {
            padding-top: 14px;
            display: grid;
            grid-auto-flow: row;
            grid-row-gap: 14px;
            text-align: left;
          }
        `}</style>
      </section>
    );
  }
}
