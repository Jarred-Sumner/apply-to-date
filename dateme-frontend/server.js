const next = require("next");
const routes = require("./routes");
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handler = routes.getRequestHandler(app);
const Raven = require("raven");

Raven.config(
  "https://91be53bb2edc4c73a00df349bfc52de2:c820e9bff08d4e6e8706ca880cb67650@sentry.io/291484"
).install();

const express = require("express");

app.prepare().then(() => {
  const expressApp = express().use(Raven.errorHandler());

  expressApp.get("/apple-app-site-association", (req, res, next) => {
    res.send({
      applinks: {
        apps: [],
        details: {
          "shipfirstlabsinc.applytodate": {
            paths: [
              "NOT /terms-of-service",
              "NOT /privacy-policy",
              "NOT /",
              "NOT /forgot-password",
              "NOT /reset-password/*",
              "*",
              "*/edit",
              "*/apply",
              "/a/*"
            ]
          }
        }
      }
    });
  });

  expressApp.use(handler).listen(parseInt(process.env.PORT || 3000, 10));
});
