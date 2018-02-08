import classNames from "classnames";
import SocialIcon from "./SocialIcon";
import Link from "next/link";

const SocialLink = ({ active = false, provider, hoverable = false }) => {
  return (
    <div
      className={classNames("SocialLink", `SocialLink--${provider}`, {
        "SocialLink--active": active,
        "SocialLink--disabled": !active,
        "SocialLink--hoverable": hoverable
      })}
    >
      <div className="SocialIcon--activeIcon">
        <SocialIcon active={true} provider={provider} />
      </div>

      <div className="SocialIcon--disabledIcon">
        <SocialIcon active={false} provider={provider} />
      </div>

      <style jsx global>{`
        .SocialLink {
          padding: 8px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: 1px dashed transparent;
          flex: 0;
          flex-grow: 0;
          flex-shrink: 0;
          width: 18px;
          height: 18x;
        }

        .SocialIcon--activeIcon,
        .SocialIcon--disabledIcon {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 18px;
          width: 18px;
        }

        .SocialLink svg {
          margin: auto;
        }

        .SocialLink--hoverable:hover .SocialIcon--activeIcon {
          display: flex;
        }

        .SocialLink--hoverable {
          cursor: pointer;
        }

        .SocialLink--disabled {
          border: 1px dashed #b9bed1;
        }

        .SocialLink--hoverable:hover {
          border-color: transparent;
        }

        .SocialLink--hoverable:hover .SocialIcon--disabledIcon,
        .SocialLink--disabled .SocialIcon--activeIcon {
          display: none;
        }

        .SocialIcon--hoverable .SocialIcon--activeIcon,
        .SocialLink--active .SocialIcon--disabledIcon {
          display: none;
        }

        .SocialLink--hoverable.SocialLink--twitter:hover,
        .SocialLink--active.SocialLink--twitter {
          background-color: #55acee;
        }

        .SocialLink--hoverable.SocialLink--snapchat:hover,
        .SocialLink--active.SocialLink--snapchat {
          background-color: #ffe400;
        }

        .SocialLink--hoverable.SocialLink--linkedin:hover,
        .SocialLink--active.SocialLink--linkedin {
          background-color: #0077b5;
        }

        .SocialLink--hoverable.SocialLink--dribbble:hover,
        .SocialLink--active.SocialLink--dribbble {
          background-color: #f26798;
        }

        .SocialLink--hoverable.SocialLink--instagram:hover,
        .SocialLink--active.SocialLink--instagram {
          background-image: linear-gradient(
            -110deg,
            #99389b 0%,
            #d94263 27%,
            #d32d79 78%,
            #ce2d94 100%
          );
        }

        .SocialLink--hoverable.SocialLink--medium:hover,
        .SocialLink--active.SocialLink--medium {
          background-color: white;
        }

        .SocialLink--hoverable.SocialLink--facebook:hover,
        .SocialLink--active.SocialLink--facebook {
          background-color: #3b5998;
        }
      `}</style>
    </div>
  );
};

export default ({ active = false, provider, hoverable = false, url }) => {
  if (url) {
    return (
      <Link href={url}>
        <a target="_blank">
          <SocialLink
            active={active}
            provider={provider}
            hoverable={hoverable}
          />
        </a>
      </Link>
    );
  } else {
    return (
      <SocialLink active={active} provider={provider} hoverable={hoverable} />
    );
  }
};
