import gulp from 'gulp'
import plumber from 'gulp-plumber'
// import gbr from 'gulp-better-rollup'
// import typescript from '@rollup/plugin-typescript'
import sourcemaps from 'gulp-sourcemaps'
import { string } from 'rollup-plugin-string'
import alias from '@rollup/plugin-alias'
import image from '@rollup/plugin-image'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { rollup } from 'gulp-rollup-2'

const { src, dest } = gulp

export default (dirs) => {
  const js = async () => {
    return src(dirs.js.src)
      .pipe(
        plumber({
          handleError: function (err) {
            console.log(err)
            this.emit('end')
          },
        })
      )
      .pipe(sourcemaps.init())
      .pipe(
        rollup({
          input: 'src/ts/index.ts',
          external: ['window'],
          plugins: [
            string({
              include: ['**/*.frag', '**/*.vert'],
            }),
            commonjs(),
            nodeResolve(),
            image(),
            typescript(),
          ],
          output: [
            {
              file: 'bundle.js',
              name: 'bundle',
              format: 'umd',
              globals: { window: 'window' },
            },
          ],
        })
      )
      .pipe(sourcemaps.write())
      .pipe(dest(dirs.js.dest))
  }
  return js
}
