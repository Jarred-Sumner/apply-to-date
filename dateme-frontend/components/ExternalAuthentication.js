import Text from "./Text";
import Icon from "./Icon";
import SocialIcon from "./SocialIcon";
import classNames from "classnames";
import Link from "next/link";
import Button from "./Button";

export const EXTERNAL_ACCOUNT_LABELS = {
  twitter: "Twitter",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  phone: "Phone"
};

const getUsername = account => {
  if (account.provider === "facebook") {
    return account.name;
  } else {
    return account.username;
  }
};

const ExternalAccount = ({ account, provider, onConnect }) => {
  return (
    <div
      className={classNames("Container", {
        "Container--connected": !!account,
        "Container--notConnected": !account
      })}
    >
      <SocialIcon provider={account.provider} width="18px" height="18px" />
      <div className="Username">
        <Text size="14px">
          {account ? getUsername(account) : EXTERNAL_ACCOUNT_LABELS[provider]}
        </Text>
      </div>

      <div className="Right">
        <div className="Connected">
          <Icon type="check" color="#53E2AF" size="12px" />

          <Text
            color="#53E2AF"
            size="12px"
            letterSpacing="1px"
            casing="uppercase"
          >
            Connected
          </Text>
        </div>

        <div className="NotConnected">
          <Button
            color={provider}
            onClick={onConnect}
            size="small"
            componentType="div"
          />
        </div>
      </div>

      <style jsx>{`
        .Container {
          background-color: #fff;
          border: 1px solid #e7ebf2;
          padding: 14px 22px;
          display: flex;
          align-items: center;
          border-radius: 100px;
          margin-bottom: 14px;
          text-align: left;
        }

        .Right {
          margin-left: auto;
          margin-top: auto;
          margin-bottom: auto;
        }

        .NotConnected,
        .Connected {
          display: grid;
          align-items: center;
          grid-auto-flow: column dense;
          grid-column-gap: 8px;
        }

        .Container--connected .NotConnected {
          display: none;
        }

        .Container--notConnected .Connected {
          display: none;
        }

        .Username {
          flex: 1;
          padding-left: 14px;
          justify-content: flex-start;
        }
      `}</style>
    </div>
  );
};

export default ExternalAccount;
