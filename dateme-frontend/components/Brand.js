import {Link} from "../routes";
import classNames from "classnames";

const WITH_TEXT = "/static/brand@2x.png";
const WITHOUT_TEXT = "/static/brand-no-text@2x.png";

export default ({ hideText = "auto" }) => {
  return (
    <div>
      <Link route="/">
        <a
          className={classNames("Brand", {
            "Brand--autohideText": hideText === "auto",
            "Brand--hideText": hideText === true
          })}
        >
          <img className="WithoutText" src={WITHOUT_TEXT} />
          <img className="WithText" src={WITH_TEXT} />
        </a>
      </Link>
      <style jsx>{`
        img {
          height: 43px;
          display: block;
        }
        a {
          height: 43px;
          display: block;
        }

        .Brand--autohideText img.WithoutText {
          display: none;
        }

        .Brand--autohideText img.WithText {
          display: block;
        }

        .Brand--hideText img.WithText {
          display: none;
        }

        @media (max-width: 460px) {
          img {
            height: 33px;
          }

          .Brand--autohideText img.WithText {
            display: none;
          }

          .Brand--autohideText img.WithoutText {
            display: block;
          }

          a {
            height: 33px;
          }
        }
      `}</style>
    </div>
  );
};
