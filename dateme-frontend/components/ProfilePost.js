import Text from "./Text";
import Linkify from "react-linkify";
import { buildImgSrc, buildImgSrcSet } from "../lib/imgUri";

export default ({ profilePost }) => {
  return (
    <div className="ProfilePost">
      <div className="Author">
        <img
          src={buildImgSrc(profilePost.authorPhoto, 34)}
          width={34}
          height={34}
          srcSet={buildImgSrcSet(profilePost.authorPhoto, 34)}
        />
        <Text
          color="#333"
          weight="semiBold"
          family="sans-serif"
          size="1rem"
          letterSpacing="0px"
        >
          {profilePost.authorName}
        </Text>
      </div>

      <div className="TextWrapper">
        <Text type="paragraph">
          <Linkify properties={{ target: "_blank", className: "LinkifyLink" }}>
            {profilePost.body}
          </Linkify>
        </Text>
      </div>

      <style jsx>{`
        .Author {
          display: flex;
          align-self: flex-start;
          align-items: center;
          margin-bottom: 0.5rem;
          padding: 20px;
        }

        img {
          margin-right: 12px;
          border-radius: 50%;
          overflow: hidden;
        }

        .TextWrapper {
          padding: 20px;
          padding-top: 0;
        }

        .ProfilePost {
          box-shadow: 1px 1px 10px #eee;
          border-radius: 8px;
          background-color: white;
          width: 100%;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};
