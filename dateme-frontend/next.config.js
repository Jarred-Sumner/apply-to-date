const withCSS = require("@zeit/next-css");

require("dotenv").config();

const path = require("path");
const Dotenv = require("dotenv-webpack");
var CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

module.exports = withCSS({
  useFileSystemPublicRoutes: false,
  webpack(config, options) {
    const { dev, isServer } = options;

    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        new Dotenv({
          path: path.join(__dirname, ".env.production"),
          systemvars: true
        })
      );
    } else {
      config.plugins.push(
        new Dotenv({
          path: path.join(__dirname, ".env.development"),
          systemvars: true
        })
      );
    }

    config.plugins.push(new CaseSensitivePathsPlugin());
    return config;
  }
});
