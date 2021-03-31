"use strict";

const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  test: /\.(jpe?g|png|gif)$/i,
  type: "asset",
};
