import gulp from 'gulp'
import browserSyncImport from 'browser-sync'
import plumber from 'gulp-plumber'
import prettify from 'gulp-prettify'
import htmlmin from 'gulp-htmlmin'
import pugPlugin from 'gulp-pug'

const { src, dest } = gulp

const browserSync = browserSyncImport.create()

export default () =>
  src(['./src/pug/*.pug'])
    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err)
          this.emit('end')
        },
      })
    )
    .pipe(pugPlugin())
    .pipe(htmlmin({ collapseWhitespace: false, removeComments: true }))
    .pipe(prettify({ indent_size: 2, unformatted: ['pre', 'code'] }))
    .pipe(dest('./dist/'))
    .pipe(browserSync.stream())
