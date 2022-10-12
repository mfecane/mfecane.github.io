const path = require('path')

import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

import contacts from './src/ts/data/contacts'
import works from './src/ts/data/works'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/partials'),
      context: {
        works,
        contacts,
      },
    }),
  ],
  resolve: {
    alias: {
      ts: path.resolve(__dirname, 'src/ts'),
      css: path.resolve(__dirname, 'src/css'),
      shaders: path.resolve(__dirname, 'src/shaders'),
      assets: path.resolve(__dirname, 'assets'),
    },
  },
  assetsInclude: ['**/*.vert', '**/*.frag'],
})
