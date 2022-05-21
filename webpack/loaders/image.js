'use strict'

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

module.exports = {
  test: /\.(jpe?g|png|gif|svg|webm)$/i,
  type: 'asset/resource',
  exclude: /\.(inline)\.(svg)$/i,
}
