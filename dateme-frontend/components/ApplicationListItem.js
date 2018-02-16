import Thumbnail from "./Thumbnail";
import Text from "./Text";
import _ from "lodash";
import { SECTION_ORDERING, SECTION_LABELS } from "../pages/CreateApplication";
import SocialLinkList from "./SocialLinkList";
import PhotoGroup from "./PhotoGroup";
import Button from "./Button";
import classNames from "classnames";

export default class ApplicationListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    };
  }

  handleExpand = () => this.setState({ isExpanded: true });

  paragraphs = () => {
    const { sections } = this.props.application;

    const filledSections = _.keys(sections).filter(key => !!sections[key]);

    const paragraphs = _.sortBy(filledSections, key =>
      SECTION_ORDERING.indexOf(key)
    ).map(section => ({
      title: SECTION_LABELS[section],
      body: sections[section]
    }));

    if (this.state.isExpanded) {
      return paragraphs;
    } else {
      return paragraphs.slice(0, 1);
    }
  };

  render() {
    const {
      photos,
      name,
      phone,
      tagline,
      socialLinks,
      sections
    } = this.props.application;
    const { isExpanded } = this.state;
    return (
      <section className="ApplicationListItem">
        <div className="Topbar">
          <div className="Title">
            <Text size="14px" weight="bold">
              {name}
            </Text>
          </div>

          <div className="SocialLinks">
            <SocialLinkList
              centered={false}
              phone={phone}
              socialLinks={socialLinks}
            />
          </div>
        </div>

        <PhotoGroup size="192px" photos={photos} />
        {!_.isEmpty(this.paragraphs()) && (
          <div
            className={classNames("Bio", {
              "Bio--expanded": isExpanded,
              "Bio--collapsed": !isExpanded
            })}
          >
            {this.paragraphs().map(paragraph => {
              return (
                <div
                  key={paragraph.title}
                  className="Section-row Section-row--bio"
                >
                  <Text className="Section-title" type="title">
                    {paragraph.title}
                  </Text>
                  <div className="Section-paragraph">
                    <Text type="paragraph">
                      {isExpanded
                        ? paragraph.body
                        : _.truncate(paragraph.body, 100)}
                    </Text>
                  </div>
                </div>
              );
            })}

            {!isExpanded && (
              <div onClick={this.handleExpand} className="ViewMore">
                <Text
                  casing="uppercase"
                  color="#999"
                  weight="bold"
                  size="13px"
                  letterSpacing="0.5px"
                  lineHeight="18px"
                >
                  Read more
                </Text>
              </div>
            )}
          </div>
        )}

        <style jsx>{`
          .ApplicationListItem {
            display: grid;
            grid-auto-flow: row;
            grid-row-gap: 28px;
            padding: 14px 24px;
            padding-bottom: 28px;
            border: 1px solid #e8edf3;
            border-radius: 4px;
            width: 100%;
            background-color: white;
            position: relative;
          }

          .Topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
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

          .ViewMore {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 0;

            background-color: #fcfcfc;
            padding: 14px 0;
            text-align: center;
            border-top: 1px solid #e8edf3;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            cursor: pointer;
          }

          .ViewMore:hover {
            background-color: #fff;
          }
        `}</style>
      </section>
    );
  }
}
