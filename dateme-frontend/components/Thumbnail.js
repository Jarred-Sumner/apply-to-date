import classNames from "classnames";

export default ({ onClick, url, isLast = false }) => (
  <div
    className={classNames("photo", {
      "photo--last": isLast,
      "photo--hoverable": !!onClick
    })}
    key={url}
    onClick={onClick}
  >
    <img src={url} />

    <style jsx>{`
      .photo {
        flex: 1;
        margin-right: 2em;
        align-self: flex-start;
        max-width: 400px;
      }

      img {
        width: 100%;
        object-fit: contain;
        background: #d8d8d8;
        box-shadow: 0 0 20px 0 rgba(160, 160, 160, 0.5);
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
    `}</style>
  </div>
);
