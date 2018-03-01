const cssLoaderConfig = require("@zeit/next-css/css-loader-config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
require("dotenv").config();

const path = require("path");
const Dotenv = require("dotenv-webpack");
var CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

module.exports = {
  useFileSystemPublicRoutes: false,
  webpack(config, options) {
    const { dev, isServer } = options;
    const extractCSSPlugin = new ExtractTextPlugin({
      filename: "static/style.css",
      disable: true
    });
    config.module.rules.push({
      test: /\.css$/,
      use: cssLoaderConfig(require("./postcss.config.js"), extractCSSPlugin, {
        cssModules: false,
        dev,
        isServer
      })
    });

    config.plugins.push(extractCSSPlugin);

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
};
