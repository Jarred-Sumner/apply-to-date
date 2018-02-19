import classNames from "classnames";
import SocialIcon from "./SocialIcon";
import Link from "next/link";

const SocialLink = ({
  active = false,
  provider,
  hoverable = false,
  width = "36px",
  height = "36px",
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames("SocialLink", `SocialLink--${provider}`, {
        "SocialLink--active": active,
        "SocialLink--disabled": !active,
        "SocialLink--hoverable": hoverable
      })}
    >
      <div className="SocialIcon--activeIcon">
        <SocialIcon
          width={parseInt(width) * 0.6}
          height={parseInt(height) * 0.6}
          active={true}
          provider={provider}
        />
      </div>

      <style jsx>{`
        .SocialIcon--activeIcon {
          width: ${width};
          height: ${height};
        }
      `}</style>

      <style jsx global>{`
        .SocialLink {
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: 1px dashed transparent;
          flex: 0;
          flex-grow: 0;
          flex-shrink: 0;
        }

        .SocialIcon--activeIcon,
        .SocialIcon--disabledIcon {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          flex-grow: 0;
        }

        .SocialLink svg {
          display: flex;
        }

        .SocialLink--hoverable {
          cursor: pointer;
        }

        .SocialLink--hoverable:hover {
          border-color: transparent;
        }

        .SocialLink--disabled {
          opacity: 0.75;
        }

        .SocialLink--twitter {
          background-color: #55acee;
        }

        .SocialLink--snapchat {
          background-color: #ffe400;
        }

        .SocialLink--linkedin {
          background-color: #0077b5;
        }

        .SocialLink--dribbble {
          background-color: #f26798;
        }

        .SocialLink--youtube {
          background-color: #ce1312;
        }

        .SocialLink--instagram {
          background-image: linear-gradient(
            -110deg,
            #99389b 0%,
            #d94263 27%,
            #d32d79 78%,
            #ce2d94 100%
          );
        }

        .SocialLink--medium {
          background-color: white;
        }

        .SocialLink--facebook {
          background-color: #3b5998;
        }

        .SocialLink--hoverable:hover,
        .SocialLink--active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ({
  active = false,
  provider,
  hoverable = false,
  url,
  onClick,
  width,
  height
}) => {
  if (url) {
    return (
      <Link href={url}>
        <a target="_blank">
          <SocialLink
            active={active}
            provider={provider}
            hoverable={hoverable}
            onClick={onClick}
            width={width}
            height={height}
          />
        </a>
      </Link>
    );
  } else {
    return (
      <SocialLink
        active={active}
        provider={provider}
        hoverable={hoverable}
        onClick={onClick}
        width={width}
        height={height}
      />
    );
  }
};
