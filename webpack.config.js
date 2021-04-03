"use strict";

var path = require("path");

var plugins = require("./webpack/plugins");

var rules = [
  require("./webpack/loaders/glsl"),
  require("./webpack/loaders/css"),
  require("./webpack/loaders/image"),
  require("./webpack/loaders/svg"),
  require("./webpack/loaders/html"),
  require("./webpack/loaders/babel"),
  // require("./webpack/loaders/html"),
];

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/ts/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ["node_modules", "src"],
    alias: {
      shaders: path.resolve(__dirname, "src/shaders"),
      js: path.resolve(__dirname, "src/js"),
      ts: path.resolve(__dirname, "src/ts"),
      css: path.resolve(__dirname, "src/css"),
      templates: path.resolve(__dirname, "src/templates"),
      assets: path.resolve(__dirname, "assets"),
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  plugins: plugins,
};
