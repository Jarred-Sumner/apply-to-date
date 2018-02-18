import SocialLink from "./SocialLink";
import invariant from "invariant";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  EmailShareButton
} from "react-share";

const PROVIDER_TO_SHARE_BUTTON = {
  facebook: FacebookShareButton,
  twitter: TwitterShareButton
};

export default ({
  provider,
  url,
  title,
  image,
  appId,
  width,
  height,
  ...otherProps
}) => {
  const ShareButton = PROVIDER_TO_SHARE_BUTTON[provider];
  invariant(ShareButton, "provider must be twitter or facebook");

  return (
    <ShareButton
      url={url}
      quote={provider === "facebook" ? title : undefined}
      title={provider === "twitter" ? title : undefined}
      hashtag={provider === "facebook" ? "#applytodate" : undefined}
      hashtags={provider === "twitter" ? ["applytodate"] : undefined}
    >
      <SocialLink
        active={true}
        width={width}
        hoverable
        height={height}
        provider={provider}
      />
    </ShareButton>
  );
};
