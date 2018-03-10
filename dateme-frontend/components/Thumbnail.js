import classNames from "classnames";
import Text from "./Text";
import { buildImgSrcSet } from "../lib/imgUri";

export default ({
  onClick,
  size = "126px",
  url,
  remoteSize,
  autoSize = true,
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
    onClick={onClick}
  >
    {url ? (
      <img
        src={url}
        key={`${url}-${size}-${remoteSize}`}
        srcSet={autoSize ? buildImgSrcSet(url, remoteSize || size) : undefined}
      />
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
        align-self: flex-start;
        display: flex;
        height: 100%;
        width: 100%;
        min-height: 0; /* NEW */
        min-width: 0; /* NEW; needed for Firefox */
      }

      .Placeholder {
        width: ${size};
        height: ${size};
        align-content: center;
        background-color: rgba(0, 0, 0, 0.75);
        border: 1px solid #b9bed1;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
      }

      img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        box-shadow: 0 0 20px rgba(160, 160, 160, 0.5);
        border-radius: 6px;
        cursor: pointer;
        transition: transform 0.1s linear;
      }

      .photo--hoverable img:hover {
        transform: scale(1.05, 1.05);
      }

      @media (max-width: 500px) {
        .photo--hoverable img:hover {
          transform: scale(1);
        }
      }

      .photo--last {
        margin-right: 0;
      }

      .photo--circle .Placeholder,
      .photo--circle img {
        border-radius: 50%;
        box-shadow: none;
      }
    `}</style>
  </div>
);
