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
    const { photos, max = 3, size } = this.props;
    const { currentPhotoIndex } = this.state;

    return (
      <div className="PhotosContainer">
        {_.range(0, max).map(index => (
          <Thumbnail
            isLast={max - 1 === index}
            key={photos[index] || index}
            url={photos[index]}
            size={size}
            onClick={() => this.setState({ currentPhotoIndex: index })}
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
            grid-template-columns: auto auto auto;
            grid-template-rows: auto;
            grid-column-gap: 28px;
          }

          @media (max-width: 500px) {
            .PhotosContainer {
              grid-template-columns: unset;
              grid-template-rows: unset;
              grid-auto-flow: row;
              grid-row-gap: 28px;
            }
          }
        `}</style>
      </div>
    );
  }
}
