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

  renderNetworks = () => {
    const {
      socialLinks = {},
      blacklist = [],
      whitelist,
      externalAuthentications = {},
      save,
      allowOAuth = false
    } = this.props;

    if (whitelist) {
      return whitelist.map(provider => (
        <EditableSocialLink
          hoverable
          key={provider}
          provider={provider}
          url={socialLinks[provider] || externalAuthentications[provider]}
          save={save}
          allowOAuth={allowOAuth}
          setURL={this.setSocialLink(provider)}
        />
      ));
    } else {
      return (
        <React.Fragment>
          {!blacklist.includes("twitter") && (
            <EditableSocialLink
              hoverable
              provider="twitter"
              url={socialLinks["twitter"] || externalAuthentications["twitter"]}
              save={save}
              allowOAuth={allowOAuth}
              setURL={this.setSocialLink("twitter")}
            />
          )}
          {!blacklist.includes("facebook") && (
            <EditableSocialLink
              hoverable
              provider="facebook"
              url={
                socialLinks["facebook"] || externalAuthentications["facebook"]
              }
              save={save}
              allowOAuth={allowOAuth}
              setURL={this.setSocialLink("facebook")}
            />
          )}
          {!blacklist.includes("youtube") && (
            <EditableSocialLink
              hoverable
              provider="youtube"
              url={socialLinks["youtube"] || externalAuthentications["youtube"]}
              save={save}
              allowOAuth={allowOAuth}
              setURL={this.setSocialLink("youtube")}
            />
          )}
          {!blacklist.includes("medium") && (
            <EditableSocialLink
              hoverable
              provider="medium"
              url={socialLinks["medium"] || externalAuthentications["medium"]}
              save={save}
              allowOAuth={allowOAuth}
              setURL={this.setSocialLink("medium")}
            />
          )}
          {!blacklist.includes("snapchat") && (
            <EditableSocialLink
              hoverable
              provider="snapchat"
              url={socialLinks["snapchat"]}
              save={save}
              allowOAuth={allowOAuth}
              setURL={this.setSocialLink("snapchat")}
            />
          )}
          {!blacklist.includes("instagram") && (
            <EditableSocialLink
              hoverable
              provider="instagram"
              url={
                socialLinks["instagram"] || externalAuthentications["instagram"]
              }
              save={save}
              allowOAuth={allowOAuth}
              setURL={this.setSocialLink("instagram")}
            />
          )}
          {!blacklist.includes("linkedin") && (
            <EditableSocialLink
              hoverable
              provider="linkedin"
              url={
                socialLinks["linkedin"] || externalAuthentications["linkedin"]
              }
              save={save}
              allowOAuth={allowOAuth}
              setURL={this.setSocialLink("linkedin")}
            />
          )}
          {!blacklist.includes("dribbble") && (
            <EditableSocialLink
              hoverable
              provider="dribbble"
              url={socialLinks["dribbble"]}
              save={save}
              allowOAuth={allowOAuth}
              setURL={this.setSocialLink("dribbble")}
            />
          )}
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <section className="Section Section--socialLinks">
        {this.renderNetworks()}
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
