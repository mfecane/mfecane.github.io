const path = require('path')

import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

const works = [
  {
    title: 'Shadercity',
    tags: ['React', 'WebGL', 'Firebase', 'GLSL'],
    github: 'https://github.com/mfecane/shadercity',
    link: 'https://shadercity.web.app/',
    image: 'assets/img/shadercity.png',
    video: 'assets/video/shadercity.webm',
    descr:
      'My biggest app to date. An alpha version of online shader playground. Uses firebase backend. Anyone can register and start having fun playing with shaders.',
  },
  {
    title: 'Boot store app',
    tags: ['React', 'WebGL', 'GLSL'],
    github: 'https://github.com/mfecane/boot',
    link: 'https://mfecane.github.io/boot/',
    image: 'assets/img/boot.png',
    video: 'assets/video/bootDemo.webm',
    descr:
      'An app for configuring of custom boot for imaginary cobbler shop. Allows selecting different materials and material colors for different parts. All design work, 3d modelling, sculpting and texturing were made by myself, no assets were outsorced. Rendering was done using THREE.JS.',
  },
  {
    title: 'Shader gallery',
    tags: ['React', 'WebGL'],
    github: 'https://github.com/mfecane/nebula',
    link: 'https://mfecane.github.io/nebula/',
    image: 'assets/img/nebula.png',
    video: 'assets/video/nebula.webm',
    descr:
      'An exhibition of shaders made by me for fun. Some shaders are customizable. Features simple UI using React.',
  },
  {
    title: 'Weather app',
    tags: ['React', 'Redux'],
    github: 'https://github.com/mfecane/weather-app/',
    link: 'https://mfecane.github.io/weather-app/',
    image: 'assets/img/weather.png',
    video: 'assets/video/weather-app.webm',
    descr:
      'Application, which displays current weather, 5 day forecast, and hourly weather for the next 24 hours. Using both OpenWeatherMap API and WeatherAPI.com.',
  },
  {
    title: 'Todo app',
    tags: ['React', 'Bootstrap'],
    github: 'https://github.com/mfecane/to-do_app',
    link: 'https://mfecane.github.io/to-do_app/',
    image: 'assets/img/todo.png',
    video: 'assets/video/to-do_list.webm',
    descr:
      'Application frontend for managing tasks. All items can be sorted by dragging, filtered, edited inline.',
  },
  {
    title: 'Mandelbruh fractal',
    tags: ['C++', 'OpenGL', 'WebGL'],
    github: 'https://github.com/mfecane/mandelbruh',
    link: 'https://mfecane.github.io/mandelbruh/',
    image: 'assets/img/mandelbrot.png',
    video: 'assets/video/mandelbruh.webm',
    descr:
      'Several implementations of mandelbrot fractal zooming applications. There are CPU, GPU (OpenGL), and GPU (Web-GL) versions. Due to the limit of precision of floating point numbers in WebGL, zooming in web version is limited.',
  },
  {
    title: 'Screen recording app',
    tags: ['C++', 'Qt', 'FFMPEG'],
    github: 'https://github.com/mfecane/rec_app',
    link: 'https://github.com/mfecane/rec_app/releases',
    image: 'assets/img/rec-app.png',
    video: 'assets/video/rec-app.webm',
    descr:
      'Windows application for easy creating time lapse recordings of user screen. This app was developed for myself for recording of my drawing and sculpting sessions.',
  },
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/partials'),
      context: {
        works,
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
