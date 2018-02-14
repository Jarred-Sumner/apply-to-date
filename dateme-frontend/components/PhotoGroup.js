import Photo from "./EditProfile/Photo";
import _ from "lodash";

export default class PhotoGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPhotoIndex: 0
    };
  }

  setCurrentPhoto = currentPhotoIndex => {
    this.setState({
      currentPhotoIndex
    });
  };

  onClickNext = () => this.setCurrentPhoto();

  render() {
    const { photos, setPhotoAtIndex, max = 3 } = this.props;
    const { currentPhotoIndex } = this.state;

    return (
      <div className="PhotosContainer">
        {_.range(0, max).map(index => (
          <Photo
            key={photos[index] || index}
            url={photos[index]}
            setURL={setPhotoAtIndex(index)}
          />
        ))}

        <Lightbox
          images={_.slice(photos || [], 0, 3).map(src => ({ src }))}
          isOpen={_.isNumber(this.state.currentPhotoIndex)}
          currentImage={currentPhotoIndex || 0}
          onClickPrev={this.previousPhoto}
          onClickNext={this.nextPhoto}
          onClose={this.closeLightbox}
        />
        <style jsx>{`
          .PhotosContainer {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
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
