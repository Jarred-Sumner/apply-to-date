import Thumbnail from "./Thumbnail";
import Text from "./Text";
import _ from "lodash";
import { SECTION_ORDERING, SECTION_LABELS } from "../pages/CreateApplication";
import SocialLinkList from "./SocialLinkList";
import PhotoGroup from "./PhotoGroup";

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
    const {
      photos,
      name,
      tagline,
      socialLinks,
      sections
    } = this.props.application;
    return (
      <section className="ViewApplication">
        <div className="Title">
          <Text size="14px" weight="bold">
            {name}
          </Text>
        </div>

        <PhotoGroup size="141px" photos={photos} />

        <div className="SocialLinks">
          <SocialLinkList centered={false} socialLinks={socialLinks} />
        </div>

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

        <style jsx>{`
          .ViewApplication {
            display: grid;
            grid-auto-flow: row;
            grid-row-gap: 28px;
            padding: 28px 50px;
            border: 1px solid #e8edf3;
            border-radius: 4px;
            width: 100%;
            max-width: 473px;
            margin-left: auto;
            margin-right: auto;
            flex: 0 0 auto;
            background-color: white;
          }

          .SocialLinks {
            text-align: left;
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
