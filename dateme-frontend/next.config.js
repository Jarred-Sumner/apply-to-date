const cssLoaderConfig = require("@zeit/next-css/css-loader-config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
require("dotenv").config();

const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
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
    config.plugins.push(
      new Dotenv({
        path: path.join(__dirname, ".env"),
        systemvars: true
      })
    );
    return config;
  }
};
