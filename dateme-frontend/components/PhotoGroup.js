import Photo from "./EditProfile/Photo";
import _ from "lodash";
import Thumbnail from "./Thumbnail";
import Lightbox from "react-images";

export default class PhotoGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPhotoIndex: null
    };
  }

  nextPhoto = () => {
    const { photos } = this.props;
    const { currentPhotoIndex } = this.state;
    if (photos.length > currentPhotoIndex + 1) {
      this.setState({
        currentPhotoIndex: currentPhotoIndex + 1
      });
    } else {
      this.setState({
        currentPhotoIndex: 0
      });
    }
  };

  previousPhoto = () => {
    const { photos } = this.props;
    const { currentPhotoIndex } = this.state;
    if (currentPhotoIndex - 1 > 0) {
      this.setState({
        currentPhotoIndex: currentPhotoIndex - 1
      });
    } else {
      this.setState({
        currentPhotoIndex: 0
      });
    }
  };

  closeLightbox = () => this.setState({ currentPhotoIndex: null });

  render() {
    const {
      photos,
      max = 3,
      size,
      showPlaceholder,
      circle = false
    } = this.props;
    const { currentPhotoIndex } = this.state;

    return (
      <div className="PhotosContainer">
        {_.range(0, max).map(index => (
          <Thumbnail
            isLast={max - 1 === index}
            key={photos[index] || index}
            url={photos[index]}
            circle={circle}
            size={size}
            showPlaceholder={showPlaceholder}
            onClick={
              photos[index]
                ? () => this.setState({ currentPhotoIndex: index })
                : undefined
            }
          />
        ))}

        <Lightbox
          images={_.slice(photos || [], 0, 3).map(src => ({ src }))}
          isOpen={_.isNumber(currentPhotoIndex)}
          currentImage={currentPhotoIndex || 0}
          onClickPrev={this.previousPhoto}
          onClickNext={this.nextPhoto}
          onClose={this.closeLightbox}
        />
        <style jsx>{`
          .PhotosContainer {
            display: grid;
            grid-gap: 28px;
            width: 100%;
            height: 100%;
            grid-template-areas: ${photos.length === 1
              ? "photo"
              : "photo photo photo"};
            grid-template-columns: ${photos.length === 1
              ? "206px"
              : "1fr 1fr 1fr"};
            grid-template-rows: 206px;
            justify-content: center;
          }

          @media (max-width: 700px) {
            .PhotosContainer {
              grid-template-areas: "photo";
              grid-template-columns: 100%;
              grid-template-rows: auto;
            }
          }
        `}</style>
      </div>
    );
  }
}
