import Photo from "./EditProfile/Photo";
import _ from "lodash";

export default ({ photos, max = 3, size, setPhotoAtIndex }) => (
  <div className="PhotosContainer">
    {_.range(0, max).map(index => (
      <Photo
        key={photos[index] || index}
        url={photos[index]}
        size={size}
        setURL={setPhotoAtIndex(index)}
      />
    ))}
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
