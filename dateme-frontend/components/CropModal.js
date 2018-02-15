import Modal, { ConfirmAndCloseButtons } from "./Modal";
import Cropper from "./Cropper";
import Text from "./Text";
import { makeAspectCrop } from "react-image-crop";

function getCroppedImg(imageSrc, pixelCrop, fileName) {
  const image = document.createElement("img");
  image.src = imageSrc.preview;

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(file => {
      file.name = fileName;
      resolve(file);
    }, "image/jpeg");
  });
}

export default class CropModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: props.file,
      crop: {
        aspect: 1
      }
    };
  }

  componentWillReceiveProps(props) {
    if (props.file) {
      this.setState({
        file: props.file,
        crop: {
          aspectRatio: 1
        }
      });
    }
  }

  handleCropChange = (crop, pixelCrop) => this.setState({ crop, pixelCrop });

  handleConfirm = async () => {
    if (this.state.pixelCrop) {
      const blob = await getCroppedImg(
        this.state.file,
        this.state.pixelCrop,
        this.state.file.name || "image.jpeg"
      );

      this.props.onCrop(blob);
    } else {
      this.props.onCrop(this.state.file);
    }
  };

  render() {
    const { file } = this.state;
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        renderHeader={() => <Text type="title">Crop photo</Text>}
        renderFooter={() => (
          <ConfirmAndCloseButtons
            onConfirm={this.handleConfirm}
            onCancel={this.props.onClose}
            isConfirmPending={this.props.isSaving}
          />
        )}
      >
        <div className="container">
          {file && (
            <Cropper
              file={file}
              onChange={this.handleCropChange}
              crop={this.state.crop}
              height="auto"
              cropperRef={cropper => (this.cropper = cropper)}
            />
          )}
        </div>

        <style jsx>{`
          .container {
            max-height: 100%;
          }
        `}</style>
      </Modal>
    );
  }
}
