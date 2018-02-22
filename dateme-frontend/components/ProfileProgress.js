import Checkbox from "./Checkbox";
import Text from "./Text";
import _ from "lodash";
import Numeral from "numeral";
import Sticky from "react-stickynode";
import { Line } from "rc-progress";
import { animateScroll } from "react-scroll";

const Step = ({ checked, children, onClick }) => (
  <div className="Step" onClick={onClick}>
    <Checkbox disabled align="left" label={children} checked={checked} />
    <style jsx>{`
      .Step {
        text-align: left;
        width: auto;
      }

      .Step:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    `}</style>
  </div>
);

export const PROFILE_SELECTORS = {
  name: "EditProfile-title",
  tagline: "EditProfile-tagline",
  contactMethod: "EditProfile-contactMethod",
  socialLinks: "EditProfile-socialLinks",
  photos: "EditProfile-photos",
  introduction: "EditProfile-introduction",
  background: "EditProfile-background"
};

const STEPS = {
  name: "name",
  tagline: "tagline",
  contactMethod: "contactMethod",
  socialLinks: "socialLinks",
  photos: "photos",
  introduction: "introduction",
  background: "background"
};

const STEP_PERCENTAGES = {
  name: 0.2,
  tagline: 0.15,
  contactMethod: 0.2,
  socialLinks: 0.2,
  photos: 0.2,
  introduction: 0.1,
  background: 0.1
};

export default class ProfileProgress extends React.Component {
  getPercentage() {
    return _.sum(
      _.values(STEPS)
        .filter(this.isChecked)
        .map(name => STEP_PERCENTAGES[name])
    );
  }

  handleScrollToEditPart = step => {
    const element = document.querySelector(`.${PROFILE_SELECTORS[step]}`);

    if (!element) {
      return;
    }

    const offset = element.getBoundingClientRect().top;
    const HEADER_OFFSET = 70;
    const PADDING = 28;
    animateScroll.scrollMore(offset - HEADER_OFFSET - PADDING);
  };

  isChecked = step => {
    const { profile } = this.props;
    if (!profile) {
      return false;
    }

    if (step === STEPS.name) {
      return _.get(profile, "name", "").length > 3;
    } else if (step === STEPS.tagline) {
      return _.get(profile, "tagline", "").length > 10;
    } else if (step === STEPS.socialLinks) {
      return (
        _.filter(_.values(_.get("profile", "socialLinks", {})), _.identity)
          .length > 1
      );
    } else if (step === STEPS.contactMethod) {
      if (profile.recommendedContactMethod === "phone") {
        return profile.phone && profile.phone.length > 5;
      } else {
        return !!_.get(profile, "socialLinks", {})[
          profile.recommendedContactMethod
        ];
      }
    } else if (step === STEPS.photos) {
      return _.get(profile, "photos", []).length > 0;
    } else if (step === STEPS.introduction) {
      return _.get(profile, "sections.introduction", "").length > 50;
    } else if (step === STEPS.background) {
      return _.get(profile, "sections.background", "").length > 50;
    } else {
      return null;
    }
  };

  render() {
    const { profile, isMobile } = this.props;

    if (isMobile) {
      return null;
    }

    return (
      <Sticky top=".name-intro">
        <div className="ProfileProgress">
          <div className="Header">
            <Text weight="bold" size="18px">
              Fill out your page
            </Text>
            <Text weight="medium" size="14px">
              {Numeral(this.getPercentage()).format("0%")} complete
            </Text>

            <div className="ProgressBar">
              <Line
                percent={this.getPercentage() * 100.0}
                trailWidth={7}
                strokeWidth={7}
                strokeLinecap="round"
                trailColor={"#E1E4EC"}
                strokeColor="#00e2aa"
              />
            </div>
          </div>
          <div className="Steps">
            <Step
              onClick={() => this.handleScrollToEditPart(STEPS.name)}
              checked={this.isChecked(STEPS.name)}
            >
              Your name
            </Step>
            <Step
              onClick={() => this.handleScrollToEditPart(STEPS.photos)}
              checked={this.isChecked(STEPS.photos)}
            >
              Upload photos
            </Step>
            <Step
              onClick={() => this.handleScrollToEditPart(STEPS.socialLinks)}
              checked={this.isChecked(STEPS.socialLinks)}
            >
              Link 2+ social profiles
            </Step>
            <Step
              onClick={() => this.handleScrollToEditPart(STEPS.contactMethod)}
              checked={this.isChecked(STEPS.contactMethod)}
            >
              Contact method for matches
            </Step>
            <Step
              onClick={() => this.handleScrollToEditPart(STEPS.tagline)}
              checked={this.isChecked(STEPS.tagline)}
            >
              One-liner
            </Step>
            <Step
              onClick={() => this.handleScrollToEditPart(STEPS.introduction)}
              checked={this.isChecked(STEPS.introduction)}
            >
              Add introduction
            </Step>
            <Step
              onClick={() => this.handleScrollToEditPart(STEPS.background)}
              checked={this.isChecked(STEPS.background)}
            >
              Add background
            </Step>
          </div>
          <style jsx>{`
            .ProfileProgress {
              position: absolute;
              left: 24px;
              top: 4rem;
              padding: 14px;
              padding-bottom: 28px;
              background-color: #f7f7f7;
              border-radius: 4px;
            }

            .Steps {
              display: grid;
              margin-top: 24px;
              grid-auto-flow: row;
              grid-row-gap: 7px;
            }

            .Header {
              display: grid;
              grid-row-gap: 4px;
            }

            @media (max-width: 1193px) {
              .ProfileProgress {
                display: none;
              }
            }
          `}</style>
        </div>
      </Sticky>
    );
  }
}
