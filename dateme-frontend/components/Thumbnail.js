import classNames from "classnames";
import Text from "./Text";

export default ({
  onClick,
  size = "126px",
  url,
  isLast = false,
  circle,
  showPlaceholder = true
}) => (
  <div
    className={classNames("photo", {
      "photo--last": isLast,
      "photo--hoverable": !!onClick,
      "photo--circle": !!circle
    })}
    key={url || undefined}
    onClick={onClick}
  >
    {url ? (
      <img src={url} />
    ) : (
      showPlaceholder && (
        <div className="Placeholder">
          <Text
            color="white"
            casing="uppercase"
            weight="semiBold"
            letterSpacing="0.5px"
            size="12px"
          >
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
        pointer-events: none;
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

      .photo--circle .Placeholder,
      .photo--circle img {
        border-radius: 50%;
      }

      @media (max-width: 500px) {
        .photo {
          margin-right: 0;
          margin-top: 2em;
        }
        .photo.photo--last.photo--hoverable.photo--circle {
          margin-top: 0em;
        }
      }
    `}</style>
  </div>
);
