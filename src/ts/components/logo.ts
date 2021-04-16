import loadSvg from 'ts/svg/read'
import shapesconfig from 'ts/svg/shapes-config'
import { easeOutCubic } from 'ts/lib/easing-functions'

import svgfile from 'assets/svg/svg-low.svg'

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
const time = { start: Date.now(), current: 0, duration: 3 }
const size = { w: 0, h: 0, cx: 0, cy: 0 }
// let points
let shapes
let parentElement: HTMLDivElement
let event = new Event('logo-animation-end')

const transform = {
  scale: 0.3,
}
let animId

interface IPoint {
  x: number
  y: number
  t: number
}

class Shape {
  points: Array<IPoint> = []
  width = 5
  drawn = 0
  color = `rgb(243, 20, 57)`

  constructor(points, width) {
    this.points = points
    this.width = width
  }

  draw(t) {
    ctx.strokeStyle = this.color

    let j = 0
    for (; j < this.points.length - 2; ++j) {
      if (this.points[j + 2].t > t) {
        break
      }

      var p0 = this.points[j]
      var p1 = this.points[j + 1]
      var p2 = this.points[j + 2]

      var x0 = (1.2 * p0.x + p1.x) / 2.2
      var y0 = (1.2 * p0.y + p1.y) / 2.2

      var x1 = (p1.x + p2.x) / 2
      var y1 = (p1.y + p2.y) / 2

      ctx.beginPath()
      ctx.lineWidth = this._getWidth(j / (this.points.length - 2))
      // ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.quadraticCurveTo(p1.x, p1.y, x1, y1)
      ctx.stroke()
    }

    this.drawn = j
  }

  _getWidth(t) {
    return 0.5 + this._parabola(t) * this.width
  }

  _parabola(t) {
    return t * (1 - t) * 4
  }

  mirror() {
    let points = this.points.map((p) => ({ ...p, x: 2 * size.cx - p.x }))
    let shape = new Shape(points, this.width)
    return shape
  }
}

const _handleShapes = function () {
  shapes.forEach((el) => {
    let t = time.current / time.duration
    t = t > 1 ? 1 : t
    t = easeOutCubic(t)
    el.draw(t)
  })
}

export const setFrame = function (t: number): void {
  _clearCanvas()
  t = easeOutCubic(t)

  shapes.forEach((el) => {
    el.draw(t)
  })
}

const _handleResize = function () {
  size.w = canvas.width = parentElement.clientWidth
  size.h = canvas.height = parentElement.clientWidth * 0.4

  size.cx = size.w / 2
  size.cy = size.h / 2

  //init(parentElement)
}

export const init = function (el) {
  parentElement = el
  canvas = document.createElement(`canvas`)
  parentElement.appendChild(canvas)
  canvas.id = 'logo-canvas'
  ctx = canvas.getContext('2d')

  _handleResize()

  window.addEventListener(`resize`, () => {
    resetTime()
    _clearCanvas()
    _handleResize()
  })

  const paths = loadSvg(svgfile, shapesconfig)
  shapes = _createShapes(paths)
}

const _createShapes = function (paths) {
  const bounds = _getBounds(paths.reduce((acc, cur) => [...acc, ...cur], []))

  _calculateScale(bounds)
  paths = paths.map((path) => path.map(_transformPoint))

  const s = paths.map((points, index) => {
    const { width } = shapesconfig[index]
    const shape = new Shape(points, (1.8 * width) / transform.scale)
    return shape
  })

  const sm = s.map((shape) => shape.mirror())

  return [...s, ...sm]
}

const _getBounds = function (points) {
  let minx = 0
  let miny = 0
  let maxx = 0
  let maxy = 0

  points.forEach((p) => {
    if (p.x < minx) {
      minx = p.x
    }
    if (p.y < miny) {
      miny = p.y
    }
    if (p.x > maxx) {
      maxx = p.x
    }
    if (p.y > maxy) {
      maxy = p.y
    }
  })

  return {
    x: minx,
    y: miny,
    width: maxx,
    height: maxy,
  }
}

const _calculateScale = function (bounds) {
  transform.scale =
    Math.min(
      (bounds.width * 2) / canvas.width,
      (bounds.height * 2) / canvas.height
    ) + 0.1
}

const _transformPoint = function (p) {
  return {
    ...p,
    x: size.cx + p.x / transform.scale,
    y: 0 + p.y / transform.scale,
  }
}

const _clearCanvas = function () {
  ctx.clearRect(0, 0, size.w, size.h)
}

const handleTime = function () {
  time.current = (Date.now() - time.start) / 1000.0
  if (time.current > time.duration) {
    canvas.dispatchEvent(event)
    window.cancelAnimationFrame(animId)
    return true
  }
  return false
}

const resetTime = function () {
  time.start = Date.now()
  time.current = (Date.now() - time.start) / 1000.0
}

const animate = function () {
  const end = handleTime()
  _clearCanvas()
  _handleShapes()
  if (!end) {
    animId = window.requestAnimationFrame(animate)
  }
}

export const start = function () {
  return new Promise((resolve, reject) => {
    resetTime()
    animate()
    canvas.addEventListener('logo-animation-end', () => resolve(null))
  })
}
