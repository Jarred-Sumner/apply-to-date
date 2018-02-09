import EditableSocialLink from "../components/EditableSocialLink";

export default class EditSocialLinks extends React.Component {
  setSocialLink = provider => {
    return url => {
      this.props.setSocialLinks({
        ...this.props.socialLinks,
        [provider]: url
      });
    };
  };

  render() {
    const { socialLinks } = this.props;

    return (
      <section className="Section Section--socialLinks">
        <EditableSocialLink
          hoverable
          provider="twitter"
          url={socialLinks["twitter"]}
          setURL={this.setSocialLink("twitter")}
        />
        <EditableSocialLink
          hoverable
          provider="facebook"
          url={socialLinks["facebook"]}
          setURL={this.setSocialLink("facebook")}
        />
        <EditableSocialLink
          hoverable
          provider="youtube"
          url={socialLinks["youtube"]}
          setURL={this.setSocialLink("youtube")}
        />
        <EditableSocialLink
          hoverable
          provider="medium"
          url={socialLinks["medium"]}
          setURL={this.setSocialLink("medium")}
        />
        <EditableSocialLink
          hoverable
          provider="snapchat"
          url={socialLinks["snapchat"]}
          setURL={this.setSocialLink("snapchat")}
        />
        <EditableSocialLink
          hoverable
          provider="instagram"
          url={socialLinks["instagram"]}
          setURL={this.setSocialLink("instagram")}
        />
        <EditableSocialLink
          hoverable
          provider="linkedin"
          url={socialLinks["linkedin"]}
          setURL={this.setSocialLink("linkedin")}
        />
        <EditableSocialLink
          hoverable
          provider="dribbble"
          url={socialLinks["dribbble"]}
          setURL={this.setSocialLink("dribbble")}
        />

        <style jsx>{`
          .Section--socialLinks {
            display: grid;
            grid-auto-flow: column;
            justify-content: center;
            grid-column-gap: 36px;
          }
        `}</style>
      </section>
    );
  }
}
