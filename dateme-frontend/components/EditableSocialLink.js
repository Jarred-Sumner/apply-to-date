import SocialLink from "./SocialLink";
import EditSocialLinkModal from "./EditSocialLinkModal";

export default class EditableSocialLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false
    };
  }

  setIsEditing = isEditing => this.setState({ isEditing });
  setURL = url => {
    this.setState({
      isEditing: false
    });

    this.props.setURL(url);
  };

  render() {
    const { provider, url = "", setURL } = this.props;

    return (
      <React.Fragment>
        <SocialLink
          onClick={() => this.setIsEditing(true)}
          provider={provider}
          hoverable
          active={!!url}
        />
        <EditSocialLinkModal
          open={this.state.isEditing}
          provider={provider}
          url={url}
          setURL={this.setURL}
          onClose={() => this.setIsEditing(false)}
          isSaving={false}
        />
      </React.Fragment>
    );
  }
}
