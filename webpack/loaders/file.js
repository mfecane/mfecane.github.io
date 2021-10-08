"use strict";

module.exports = {
  test: /\.(woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
  loader: "file-loader",
  exclude: /\.inline\.svg$/,
};
