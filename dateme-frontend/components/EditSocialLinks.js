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
    const { socialLinks = {}, blacklist = [] } = this.props;

    return (
      <section className="Section Section--socialLinks">
        {!blacklist.includes("twitter") && (
          <EditableSocialLink
            hoverable
            provider="twitter"
            url={socialLinks["twitter"]}
            setURL={this.setSocialLink("twitter")}
          />
        )}
        {!blacklist.includes("facebook") && (
          <EditableSocialLink
            hoverable
            provider="facebook"
            url={socialLinks["facebook"]}
            setURL={this.setSocialLink("facebook")}
          />
        )}
        {!blacklist.includes("youtube") && (
          <EditableSocialLink
            hoverable
            provider="youtube"
            url={socialLinks["youtube"]}
            setURL={this.setSocialLink("youtube")}
          />
        )}
        {!blacklist.includes("medium") && (
          <EditableSocialLink
            hoverable
            provider="medium"
            url={socialLinks["medium"]}
            setURL={this.setSocialLink("medium")}
          />
        )}
        {!blacklist.includes("snapchat") && (
          <EditableSocialLink
            hoverable
            provider="snapchat"
            url={socialLinks["snapchat"]}
            setURL={this.setSocialLink("snapchat")}
          />
        )}
        {!blacklist.includes("instagram") && (
          <EditableSocialLink
            hoverable
            provider="instagram"
            url={socialLinks["instagram"]}
            setURL={this.setSocialLink("instagram")}
          />
        )}
        {!blacklist.includes("linkedin") && (
          <EditableSocialLink
            hoverable
            provider="linkedin"
            url={socialLinks["linkedin"]}
            setURL={this.setSocialLink("linkedin")}
          />
        )}
        {!blacklist.includes("dribbble") && (
          <EditableSocialLink
            hoverable
            provider="dribbble"
            url={socialLinks["dribbble"]}
            setURL={this.setSocialLink("dribbble")}
          />
        )}
        <style jsx>{`
          .Section--socialLinks {
            display: grid;
            grid-auto-flow: column;
            justify-content: center;
            grid-column-gap: 36px;
          }

          @media (max-width: 600px) {
            .Section--socialLinks {
              display: grid;
              grid-template-rows: 1fr;
              grid-template-columns: 36px 36px 36px;
              grid-auto-flow: row;
              max-width: 100%;
              justify-content: center;
              grid-row-gap: 36px;
            }
          }
        `}</style>
      </section>
    );
  }
}
