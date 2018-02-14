import Thumbnail from "./Thumbnail";
import Text from "./Text";
import _ from "lodash";
import { SECTION_ORDERING, SECTION_LABELS } from "../pages/CreateApplication";
import SocialLinkList from "./SocialLinkList";

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
    const { photoUrl, name, tagline, socialLinks } = this.props.application;
    return (
      <section className="ViewApplication">
        {photoUrl && (
          <div className="Photo">
            <Thumbnail url={photoUrl} />
          </div>
        )}
        <div className="Title">
          <Text type="ProfilePageTitle" align="center">
            {name}
          </Text>
        </div>

        {tagline && (
          <div className="Tagline">
            <Text type="Tagline" align="center">
              {tagline}
            </Text>
          </div>
        )}

        <div className="SocialLinks">
          <SocialLinkList socialLinks={socialLinks} />
        </div>

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
            flex: 0 0 auto;
            text-align: center;
            background-color: white;
          }

          .Photo {
            margin-top: -100px;
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
