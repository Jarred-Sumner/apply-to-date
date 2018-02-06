const cssLoaderConfig = require("@zeit/next-css/css-loader-config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
    return config;
  }
};
