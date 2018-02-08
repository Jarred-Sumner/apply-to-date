import Text from "../../components/Text";
import Dropzone from "react-dropzone";
import S3Upload from "react-s3-uploader/s3upload";
import Button from "../../components/Button";
import Thumbnail from "../Thumbnail";
import Modal from "../Modal";
import Alert from "../Alert";
import CropModal from "../CropModal";
import { BASE_HOSTNAME } from "../../api";

const Status = {
  empty: "empty",
  preview: "preview",
  uploading: "uploading",
  cropping: "cropping",
  error: "error"
};

const UploadPhoto = ({ file, status }) => {
  return (
    <div className="container">
      <div className="Button">
        <Button pending={status === Status.uploading}>Choose picture</Button>
      </div>
      <Text type="muted">or drag'n'drop here</Text>

      <style jsx>{`
        .container {
          display: flex;
          margin-top: auto;
          margin-bottom: auto;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          width: auto;
          height: 100%;
        }

        .Button {
          margin-bottom: 14px;
        }
      `}</style>
    </div>
  );
};

export default class Photo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: this.getInitialStatus(props),
      url: props.url,
      file: null
    };
  }

  getInitialStatus = props => (props.url ? Status.preview : Status.empty);

  handleDrop = files => {
    if (_.isEmpty(files) || files.length > 1) {
      Alert.error("Please pick a single image");
      return;
    }

    const file = files[0];

    this.setState({
      file,
      status: Status.cropping
    });
  };

  onCancelCrop = () => {
    this.setState({
      file: null,
      status: this.getInitialStatus(this.props)
    });
  };

  handleCrop = blob => {
    if (this.state.status === Status.uploading) {
      return;
    }

    this.setState({
      file: blob,
      status: Status.uploading
    });

    this.uploader = new S3Upload({
      files: [blob],
      signingUrl: "/images/sign",
      onFinishS3Put: this.handleUploadComplete,
      onError: this.handleUploadError,
      server: BASE_HOSTNAME
    });

    Alert.info("Uploading...please wait");
  };

  handleUploadError = error => {
    console.error(error);
    Alert.error("Something went wrong while uploading. Please try again");

    this.setState({
      status: Status.cropping
    });
  };

  handleUploadComplete = upload => {
    const { publicUrl } = upload;

    this.props.setURL(publicUrl);
    Alert.success("Upload complete!");
  };

  componentWillUnmount() {
    this.uploader = null;
  }

  render() {
    const { status, file, url } = this.state;

    return (
      <div className="container">
        <React.Fragment>
          <Dropzone
            style={{}}
            multiple={false}
            disabled={status === Status.cropping}
            accept="image/*"
            onDrop={this.handleDrop}
          >
            {status === Status.preview ? (
              <Thumbnail url={url} isLast />
            ) : (
              <UploadPhoto url={url} status={status} />
            )}
          </Dropzone>
          <CropModal
            open={!!(status === Status.cropping && file)}
            onClose={this.onCancelCrop}
            onCrop={this.handleCrop}
            isSaving={status === Status.uploading}
            file={file}
          />
        </React.Fragment>
        <style jsx>{`
          .container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 206px;

            border: 2px dashed #e3e3e6;
            border-radius: 4px;

            cursor: pointer;
          }

          .container:hover {
            border-color: #ababab;
          }
        `}</style>
      </div>
    );
  }
}
