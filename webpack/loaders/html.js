'use strict'

const Handlebars = require('handlebars')

module.exports = {
  test: /\.html$/i,
  use: {
    loader: 'html-loader',
  },
}
