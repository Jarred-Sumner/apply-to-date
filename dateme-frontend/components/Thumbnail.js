import classNames from "classnames";
import Text from "./Text";

export default ({
  onClick,
  size = "126px",
  url,
  isLast = false,
  showPlaceholder = true
}) => (
  <div
    className={classNames("photo", {
      "photo--last": isLast,
      "photo--hoverable": !!onClick
    })}
    key={url || undefined}
    onClick={onClick}
  >
    {url ? (
      <img src={url} />
    ) : (
      showPlaceholder && (
        <div className="Placeholder">
          <Text color="white" size="12px">
            no photo
          </Text>
        </div>
      )
    )}

    <style jsx>{`
      .photo {
        flex: 1;
        align-self: flex-start;
      }

      .Placeholder {
        width: ${size};
        height: ${size};
        background-color: rgba(0, 0, 0, 0.75);
        border: 1px solid #b9bed1;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      img {
        width: ${size};
        height: ${size};
        object-fit: cover;
        background: transparent;
        box-shadow: 0 0 20px rgba(160, 160, 160, 0.5);
        border-radius: 6px;
        cursor: pointer;
        transition: transform 0.1s linear;
      }

      .photo--hoverable img:hover {
        transform: scale(1.05, 1.05);
      }

      .photo--last {
        margin-right: 0;
      }

      @media (max-width: 500px) {
        .photo {
          margin-right: 0;
          margin-top: 2em;
        }
      }
    `}</style>
  </div>
);
