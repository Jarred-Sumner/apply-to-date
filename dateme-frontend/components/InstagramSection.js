import { getFeed } from "../api";
import InstagramViewer from "./InstagramViewer";
import Spinner from "./Spinner";

const STATUS = {
  loading: "loading",
  error: "error",
  completed: "loaded"
};

export default class InstagramSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: STATUS.loading,
      instagramProfile: null,
      photos: []
    };
  }

  fetchInstagram = () => {
    if (this.state.status !== STATUS.loading) {
      this.setState({ status: STATUS.loading });
    }

    getFeed("instagram", this.props.profileId, this.props.applicationId)
      .then(response => {
        this.setState({
          instagramProfile: response.body.profile,
          photos: response.body.data || [],
          status: STATUS.completed
        });
      })
      .catch(error => this.setState({ status: STATUS.error }));
  };

  async componentDidMount() {
    this.fetchInstagram();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profileId !== this.props.profileId) {
      this.fetchInstagram();
    }
  }

  render() {
    const { photos, instagramProfile, status, spacing } = this.state;
    const { marginTop = "4rem", overflow } = this.props;

    if (status === STATUS.completed) {
      return (
        <section>
          <InstagramViewer
            photos={this.state.photos}
            spacing={spacing}
            overflow={overflow}
            instagramProfile={this.state.instagramProfile}
          />

          <style jsx>{`
            section {
              margin-top: ${marginTop};
            }
          `}</style>
        </section>
      );
    } else if (status === STATUS.loading) {
      return (
        <div>
          <Spinner color="#bc2a8d" size={28} />

          <style jsx>{`
            div {
              display: grid;
              justify-content: center;
              align-items: center;
              grid-row-gap: 0px;
              height: 200px;
              width: 100%;
            }
          `}</style>
        </div>
      );
    } else {
      return null;
    }
  }
}
