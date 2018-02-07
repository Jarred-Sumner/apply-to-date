import Text from "../../components/Text";
import Dropzone from "react-dropzone";
import S3Upload from "react-s3-uploader/s3upload";
import Button from "../../components/Button";
import Thumbnail from "../Thumbnail";
import Modal from "../Modal";

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
      status: props.url ? Status.preview : Status.empty,
      url: props.url,
      file: null
    };
  }

  render() {
    const { status, file, url } = this.state;

    return (
      <div className="container">
        <Dropzone
          style={{}}
          multiple={false}
          accept="image/*"
          onDrop={this.handleDrop}
        >
          {status === Status.preview ? (
            <Thumbnail url={url} isLast />
          ) : (
            <UploadPhoto url={url} status={status} />
          )}
        </Dropzone>
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
