import { getFeed } from "../api";
import _ from "lodash";
import Text from "./Text";
import Icon from "./Icon";
import Lightbox from "react-images";
import Numeral from "numeral";
import LazyLoad from "react-lazyload";
import Spinner from "./Spinner";

const MAX_NUMBER_OF_PHOTOS = 12;

const PhotoSpinner = () => (
  <div>
    <Spinner color="#bc2a8d" size={28} />
    <style jsx>{`
      div {
        border-radius: 4px;
        background: #d8d8d8;
        height: 213px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
);

const InstagramPhoto = ({ post, onClick, overflow }) => {
  return (
    <div onClick={onClick} className="Post">
      <img src={post.images.standard_resolution.url} />

      <style jsx>{`
        .Post {
          background: #d8d8d8;
          box-shadow: 0 0 16px 0 rgba(160, 160, 160, 0.5);
          border-radius: 4px;
          display: flex;
          grid-column: 1fr;
          grid-row: 1fr;
          grid-area: "photo";
          cursor: pointer;
          transition: transform 0.1s linear;
        }

        @media (min-width: 600px) {
          .Post:hover {
            transform: scale(1.05, 1.05);
          }
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 50%;
          border-radius: 4px;
          display: flex;
        }
      `}</style>
    </div>
  );
};

const InstagramViewMore = ({ username }) => {
  return (
    <a
      href={`https://instagram.com/${username}`}
      target="_blank"
      className="Wrapper"
    >
      <div className="Instagram">
        <Icon type="instagram" color="white" size="33px" />
        <Text color="white" size="12px" weight="bold">
          See more
        </Text>
      </div>

      <style jsx>{`
        .Instagram {
          background: black;
          box-shadow: 0 0 16px 0 rgba(160, 160, 160, 0.5);
          border-radius: 4px;
          display: grid;
          grid-template-rows: auto auto;
          align-content: center;
          grid-column: 1fr;
          grid-row: 1fr;
          grid-area: "photo";
          justify-content: center;
          align-items: center;
          grid-row-gap: 7px;
          min-height: 100px;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    </a>
  );
};

export default class InstagramViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPhotoIndex: null
    };
  }

  setPhotoIndex = currentPhotoIndex => this.setState({ currentPhotoIndex });
  nextPhoto = () =>
    this.setState({
      currentPhotoIndex: (this.state.currentPhotoIndex || 0) + 1
    });

  previousPhoto = () =>
    this.setState({
      currentPhotoIndex: (this.state.currentPhotoIndex || 1) - 1
    });

  closeLightbox = () => this.setState({ currentPhotoIndex: null });

  defaultGridArea = max => {
    return _.times(Math.min(this.props.photos.length, max))
      .map(() => "photo")
      .join(" ");
  };

  render() {
    const { currentPhotoIndex } = this.state;
    const { photos, instagramProfile, spacing = 28, overflow } = this.props;

    return (
      <div className="Wrapper">
        {instagramProfile && (
          <div className="Title">
            <a
              target="_blank"
              href={`https://instagram.com/${instagramProfile.username}`}
              className="Followers"
            >
              <Icon type="instagram" color="#bc2a8d" size="14px" />
              <Text weight="semiBold" color="#bc2a8d" size="14px">
                {Numeral(instagramProfile.counts.followed_by).format("0,0")}{" "}
                followers
              </Text>
            </a>
          </div>
        )}
        <div className="Container">
          {photos
            .slice(0, MAX_NUMBER_OF_PHOTOS - 1)
            .map((photo, index) => (
              <InstagramPhoto
                onClick={() => this.setPhotoIndex(index)}
                post={photo}
                overflow={overflow}
                key={photo.id}
              />
            ))}
          {instagramProfile &&
            photos.length >= MAX_NUMBER_OF_PHOTOS && (
              <InstagramViewMore username={instagramProfile.username} />
            )}
        </div>

        <Lightbox
          images={_.slice(photos).map(photo => ({
            src: photo.images.standard_resolution.url
          }))}
          isOpen={_.isNumber(currentPhotoIndex)}
          currentImage={currentPhotoIndex || 0}
          onClickPrev={this.previousPhoto}
          onClickNext={this.nextPhoto}
          onClose={this.closeLightbox}
        />

        <style jsx>{`
          .Wrapper {
            display: grid;
          }

          .Container {
            display: grid;
            grid-column-gap: ${spacing}px;
            grid-row-gap: ${spacing}px;
            width: 100%;

            grid-template-areas: "${this.defaultGridArea(4)}";
            grid-template-rows: ${
              this.props.photos.length === 1 ? "206px" : "unset"
            };
            grid-template-columns: ${
              this.props.photos.length === 1 ? "206px" : "unset"
            };
          }

          .Followers {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 7px;
            text-align: left;
          }

          .Title {
            margin-bottom: 14px;
            display: flex;
            align-items: center;
          }

          @media (max-width: 720px) {
            .Container {
              grid-template-areas: "${this.defaultGridArea(3)}";
            }
          }

          @media (max-width: 500px) {
            .Container {
              grid-template-areas: "${this.defaultGridArea(2)}";
            }
          }

          @media (max-width: 450px) {
            .Container {
              grid-template-areas: "photo";
            }
          }
        `}</style>
      </div>
    );
  }
}
