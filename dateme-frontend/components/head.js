import NextHead from "next/head";
import { string } from "prop-types";
import RootStyles from "./Root";
import ReactGA from "react-ga";
import FullStory from "./FullStory";
import Router from "next/router";

const defaultDescription = "";
const defaultOGURL = "";
const defaultOGImage = "";

if (typeof window !== "undefined") {
  ReactGA.initialize(process.env.GOOGLE_ANALYTICS, {
    debug: process.env.NODE_ENV !== "production",
    titleCase: false
  });

  ReactGA.plugin.require("cleanUrlTracker");
  ReactGA.plugin.require("eventTracker");
  ReactGA.plugin.require("impressionTracker");
  ReactGA.plugin.require("maxScrollTracker");
  ReactGA.plugin.require("mediaQueryTracker");
  ReactGA.plugin.require("outboundFormTracker");
  ReactGA.plugin.require("outboundLinkTracker");
  ReactGA.plugin.require("pageVisibilityTracker");
  ReactGA.plugin.require("socialWidgetTracker");

  ReactGA.pageview(window.location.pathname);
  Router.onRouteChangeComplete = url => {
    ReactGA.pageview(url);
  };
}

const Head = props => (
  <React.Fragment>
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{props.title || ""}</title>
      <meta
        name="description"
        content={props.description || defaultDescription}
      />
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      <link
        rel="icon"
        sizes="192x192"
        href={props.favicon || "/static/favicon.png"}
      />
      <meta property="fb:app_id" content="2014016792189722" />
      <meta property="og:type" content={props.type || "website"} />
      {props.disableGoogle && <meta name="googlebot" content="noindex" />}
      {props.username && (
        <meta property="profile:username" content={props.username} />
      )}
      {props.gender && (
        <meta property="profile:gender" content={props.gender} />
      )}
      <link
        rel="apple-touch-icon"
        href={props.favicon || "/static/favicon.png"}
      />
      <link rel="icon" href={props.favicon || "/static/favicon.png"} />
      <meta property="og:url" content={props.url || defaultOGURL} />
      <meta property="og:title" content={props.title || ""} />
      <meta
        property="og:description"
        content={props.description || defaultDescription}
      />
      <meta name="twitter:site" content={props.url || defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
      <meta property="og:image" content={props.ogImage || defaultOGImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <link
        key="Open Sans"
        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700,900"
        rel="stylesheet"
      />

      <link
        key="Frank Ruhl"
        href="https://fonts.googleapis.com/css?family=Frank+Ruhl+Libre:300,400,500,700,900"
        rel="stylesheet"
      />
      <script
        type="text/javascript"
        key="autotrack"
        src="https://cdnjs.cloudflare.com/ajax/libs/autotrack/2.4.1/autotrack.js"
      />
    </NextHead>
    <FullStory />
    <RootStyles />
  </React.Fragment>
);

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
};

export default Head;
