import loadSvg from 'ts/svg/read'
import shapesconfig from 'ts/svg/shapes-config'
import { easeOutCubic } from 'ts/lib/easing-functions'

interface IPoint {
  x: number
  y: number
  t: number
}

type IPath = Array<IPoint>

interface IBounds {
  x: number
  y: number
  width: number
  height: number
}

class Shape {
  points: Array<IPoint> = []
  width = 5
  drawn = 0
  color = `rgb(243, 20, 57)`

  ctx: CanvasRenderingContext2D
  size = { w: 0, h: 0, cx: 0, cy: 0 }

  constructor(points: IPath, width: number) {
    this.points = points
    this.width = width
  }

  draw(t: number) {
    this.ctx.strokeStyle = this.color

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

      this.ctx.beginPath()
      this.ctx.lineWidth = this._getWidth(j / (this.points.length - 2))
      this.ctx.beginPath()
      this.ctx.moveTo(x0, y0)
      this.ctx.quadraticCurveTo(p1.x, p1.y, x1, y1)
      this.ctx.stroke()
    }

    this.drawn = j
  }

  _getWidth(t: number) {
    return 0.5 + this._3rdPowerPoly(t) * this.width
  }

  _parabola(t: number) {
    return t * (1 - t) * 4
  }

  _3rdPowerPoly(t: number) {
    return t * (1 - t) * (1 + t) * 2.7
  }

  mirror() {
    let points = this.points.map((p) => ({ ...p, x: 2 * this.size.cx - p.x }))
    let shape = new Shape(points, this.width)
    shape.ctx = this.ctx
    shape.size = this.size
    return shape
  }
}

export default class SvgPathAnimation {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  parentElement: HTMLDivElement

  time = { start: Date.now(), current: 0, duration: 3 }
  size = { w: 0, h: 0, cx: 0, cy: 0 }

  shapes: Array<Shape> = []

  transform = { scale: 0.3 }
  animId: number = 0

  constructor(el: HTMLDivElement, svgfile: any) {
    this.parentElement = el
    this.canvas = document.createElement(`canvas`)
    this.parentElement.appendChild(this.canvas)
    this.canvas.id = 'logo-canvas'
    this.ctx = this.canvas.getContext('2d')

    this._handleResize()

    window.addEventListener(`resize`, () => {
      this._resetTime()
      this._clearCanvas()
      this._handleResize()
    })

    const paths = loadSvg(svgfile, shapesconfig)
    this.shapes = this._createShapes(paths)
  }

  _handleShapes() {
    this.shapes.forEach((el: Shape) => {
      let t = this.time.current / this.time.duration
      t = t > 1 ? 1 : t
      t = easeOutCubic(t)
      el.draw(t)
    })
  }

  setFrame(t: number): void {
    this._clearCanvas()
    t = easeOutCubic(t)

    this.shapes.forEach((el: Shape) => {
      el.draw(t)
    })
  }

  _handleResize() {
    this.size.w = this.canvas.width = this.parentElement.clientWidth
    this.size.h = this.canvas.height = this.parentElement.clientWidth * 0.4

    this.size.cx = this.size.w / 2
    this.size.cy = this.size.h / 2
  }

  _createShapes(paths) {
    const bounds = this._getBounds(
      paths.reduce((acc: IPath, cur: IPath) => [...acc, ...cur], [])
    )

    this._calculateScale(bounds)
    paths = paths.map((path: IPath) =>
      path.map(this._transformPoint.bind(this))
    )

    const s = paths.map((points: IPath, index: number) => {
      const { width } = shapesconfig[index]
      const shape = new Shape(points, (1.8 * width) / this.transform.scale)
      shape.ctx = this.ctx
      shape.size = this.size
      return shape
    })

    const sm = s.map((shape: Shape) => shape.mirror())

    return [...s, ...sm]
  }

  _getBounds(points: IPath): IBounds {
    let minx = 0
    let miny = 0
    let maxx = 0
    let maxy = 0

    points.forEach((p: IPoint) => {
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

  _calculateScale(bounds: IBounds) {
    this.transform.scale =
      Math.min(
        (bounds.width * 2) / this.canvas.width,
        (bounds.height * 2) / this.canvas.height
      ) + 0.1
  }

  _transformPoint(p: IPoint) {
    return {
      ...p,
      x: this.size.cx + p.x / this.transform.scale,
      y: 0 + p.y / this.transform.scale,
    }
  }

  _clearCanvas() {
    this.ctx.clearRect(0, 0, this.size.w, this.size.h)
  }

  _handleTime() {
    this.time.current = (Date.now() - this.time.start) / 1000.0
    if (this.time.current > this.time.duration) {
      let event = new Event('logo-animation-end')
      this.canvas.dispatchEvent(event)
      window.cancelAnimationFrame(this.animId)
      return true
    }
    return false
  }

  _resetTime() {
    this.time.start = Date.now()
    this.time.current = (Date.now() - this.time.start) / 1000.0
  }

  animate() {
    const end = this._handleTime()
    this._clearCanvas()
    this._handleShapes()
    if (!end) {
      this.animId = window.requestAnimationFrame(this.animate.bind(this))
    }
  }

  start() {
    return new Promise((resolve, reject) => {
      this._resetTime()
      this.animate()
      this.canvas.addEventListener('logo-animation-end', () => {
        resolve(null)
      })
    })
  }
}
