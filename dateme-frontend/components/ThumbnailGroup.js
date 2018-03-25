import React from "react";
import Thumbnail from "./Thumbnail";
import { SPACING } from "../helpers/styles";

export default class ThumbnailGroup extends React.PureComponent {
  render() {
    const {
      photos,
      size,
      circle,
      hideBorder,
      whiteBorder,
      ids,
      type,
      types = []
    } = this.props;
    return (
      <div className="Container">
        {photos
          .slice(0, 2)
          .map((url, index) => (
            <Thumbnail
              key={url}
              circle={circle}
              hideBorder={hideBorder}
              url={url}
              type={types ? types[index] || type : type}
              id={ids[index]}
              whiteBorder={whiteBorder}
              size={size}
            />
          ))}

        <style jsx>{`
          .Container {
            display: grid;
            grid-auto-flow: column;
            grid-gap: ${SPACING.NORMAL}px;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }
}
