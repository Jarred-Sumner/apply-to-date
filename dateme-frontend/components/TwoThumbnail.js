import Thumbnail from "./Thumbnail";
import Text from "./Text";

export default class TwoThumbnail extends React.Component {
  render() {
    const { leftURL, left, rightURL, autoSize, right } = this.props;

    return (
      <div className="Pics">
        <a className="Pic" key={leftURL} target="_blank" href={leftURL}>
          <Thumbnail autoSize={autoSize} size="107px" url={left} circle />
        </a>
        <div className="Divider">
          <Text size="30px" lineHeight="40px">
            +
          </Text>
        </div>
        <a className="Pic" key={rightURL} target="_blank" href={rightURL}>
          <Thumbnail autoSize={autoSize} size="107px" url={right} circle />
        </a>

        <style jsx>{`
          .Pics {
            display: flex;
            align-items: center;
            justify-content: center;
            align-content: center;
            align-self: center;
          }

          .Divider {
            flex: 0 0 40px;
            text-align: center;
          }

          .Pic {
            transform: scale(0);
            animation-delay: 0.2s;
            opacity: 0;
            align-self: center;
            flex: 0 0 107px;
            animation: show-photo 0.8s ease-in-out;
            animation-fill-mode: forwards;
          }

          .Pic :global(img) {
            width: 107px;
            height: 107px;
          }

          @keyframes show-photo {
            0% {
              opacity: 0;
              transform: scale(0);
            }

            50% {
              opacity: 0.9;
              transform: scale(1.1);
            }
            80% {
              opacity: 1;
              transform: scale(0.89);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  }
}
