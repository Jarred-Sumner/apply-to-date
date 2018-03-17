import SocialLink from "./SocialLink";
import _ from "lodash";
import classNames from "classnames";
import Icon from "./Icon";
import Button from "./Button";

const PhoneButton = ({ phone }) => {
  return (
    <Button
      color="black"
      icon={<Icon type="phone" size="12px" color="#333" />}
      fill={false}
      size="small"
      href={`sms://${phone}`}
    >
      {phone}
    </Button>
  );
};

export default ({ socialLinks, phone, spacing = "32px", centered = true }) => {
  if (_.isEmpty(_.filter(_.values(socialLinks), _.identity)) && !phone) {
    return null;
  }

  return (
    <section className={classNames({ "Section--centered": centered })}>
      {phone && <PhoneButton phone={phone} />}
      {_.map(
        socialLinks,
        (url, provider) =>
          url && (
            <SocialLink
              provider={provider}
              url={url.replace("@", "")}
              key={provider}
              active
            />
          )
      )}
      <style jsx>{`
        section {
          display: grid;
          grid-auto-flow: column;
          grid-column-gap: ${spacing};
          justify-content: flex-start;
        }

        .Section--centered {
          justify-content: center;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </section>
  );
};
