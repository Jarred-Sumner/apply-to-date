import React from "react";
import Button from "./Button";
import SocialIcon from "./SocialIcon";
import Icon from "./Icon";
import { COLORS } from "../helpers/styles";
import { himHerThem } from "../lib/pronoun";
import { phoneLabel } from "../helpers/phone";

export const getActiveSocialLinks = socialLinks => {
  return _.pick(
    socialLinks,
    _.keys(socialLinks).filter(provider => !!socialLinks[provider])
  );
};

export const CONTACT_METHODS = {
  phone: "phone",
  twitter: "twitter",
  facebook: "facebook",
  instagram: "instagram"
};

export const getContactMethodType = ({ socialLinks, phone }) => {
  if (phone) {
    return CONTACT_METHODS.phone;
  } else if (socialLinks) {
    const activeSocialLinks = getActiveSocialLinks(socialLinks);

    if (activeSocialLinks.instagram) {
      return CONTACT_METHODS.instagram;
    } else if (activeSocialLinks.facebook) {
      return CONTACT_METHODS.facebook;
    } else if (activeSocialLinks.twitter) {
      return CONTACT_METHODS.twitter;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const getContactMethodValue = ({ socialLinks, phone }) => {
  const contactMethod = getContactMethodType({ socialLinks, phone });

  if (contactMethod === CONTACT_METHODS.phone) {
    return phone;
  } else {
    return socialLinks[contactMethod];
  }
};

export const getContactMethodURI = ({ socialLinks, phone }) => {
  const contactMethod = getContactMethodType({ socialLinks, phone });

  if (contactMethod === CONTACT_METHODS.phone) {
    return `sms://${phone}`;
  } else {
    return socialLinks[contactMethod];
  }
};

export const getContactMethodLabel = ({ socialLinks, phone, sex }) => {
  const contactMethod = getContactMethodType({ socialLinks, phone });

  if (contactMethod === CONTACT_METHODS.phone) {
    return `Text ${himHerThem(sex)}`.toUpperCase();
  } else {
    return `DM ${himHerThem(sex)}`.toUpperCase();
  }
};

export const getContactMethodTypeLabel = ({ socialLinks, phone, sex }) => {
  const contactMethod = getContactMethodType({ socialLinks, phone });

  if (contactMethod === CONTACT_METHODS.phone) {
    return `Text`;
  } else {
    return `DM`;
  }
};

export const getContactMethod = ({ socialLinks, phone, sex }) => {
  return {
    uri: getContactMethodURI({ socialLinks, phone }),
    label: getContactMethodLabel({ socialLinks, phone, sex })
  };
};

export default class ContactButton extends React.Component {
  render() {
    const { socialLinks, phone } = this.props;
    const contactMethod = getContactMethodType({ socialLinks, phone });
    if (contactMethod === CONTACT_METHODS.phone) {
      return (
        <Button
          icon={<Icon type="phone" active width="14px" height="14px" />}
          color="black"
          size={"normal"}
          href={`sms://${phone}`}
        >
          {phoneLabel(phone)}
        </Button>
      );
    } else if (contactMethod === CONTACT_METHODS.instagram) {
      return (
        <Button
          icon={
            <SocialIcon
              provider="instagram"
              active
              width="14px"
              height="14px"
            />
          }
          size={"normal"}
          color="instagram"
          target="_blank"
          href={socialLinks.instagram}
        >
          DM on Instagram
        </Button>
      );
    } else if (contactMethod === CONTACT_METHODS.facebook) {
      return (
        <Button
          icon={
            <SocialIcon provider="facebook" active width="14px" height="14px" />
          }
          color="facebook"
          size={"normal"}
          target="_blank"
          href={socialLinks.facebook}
        >
          Message on Facebook
        </Button>
      );
    } else if (contactMethod === CONTACT_METHODS.twitter) {
      return (
        <Button
          icon={
            <SocialIcon provider="twitter" active width="14px" height="14px" />
          }
          color="twitter"
          size={"normal"}
          target="_blank"
          href={socialLinks.twitter}
        >
          DM on Twitter
        </Button>
      );
    } else {
      return null;
    }
  }
}
