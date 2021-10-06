import SvgPath from 'ts/svg/read'
import { easeOutCubic } from 'ts/lib/easing-functions'

export interface IPoint {
  x: number
  y: number
  t: number
}

export type IPath = Array<IPoint>

export interface IBounds {
  x: number
  y: number
  width: number
  height: number
}

export type TShapesConfig = Array<{
  wdth: number
  start: number
  end: number
}>

export class Shape {
  points: Array<IPoint> = []
  width = 5
  drawn = 0
  color = `#bec9d1`
  index = 0
  ctx: CanvasRenderingContext2D
  size = { w: 0, h: 0, cx: 0, cy: 0 }

  constructor(points: IPath, width: number) {
    this.points = points
    this.width = width
  }

  draw(t: number): void {
    this.ctx.strokeStyle = this.color

    let j = 0
    for (; j < this.points.length - 2; ++j) {
      if (this.points[j + 2].t > t) {
        break
      }

      const p0 = this.points[j]
      const p1 = this.points[j + 1]
      const p2 = this.points[j + 2]

      const x0 = (1.2 * p0.x + p1.x) / 2.2
      const y0 = (1.2 * p0.y + p1.y) / 2.2

      const x1 = (p1.x + p2.x) / 2
      const y1 = (p1.y + p2.y) / 2

      this.ctx.beginPath()
      this.ctx.lineWidth = this._getWidth(j / (this.points.length - 2))
      this.ctx.beginPath()
      this.ctx.moveTo(x0, y0)
      this.ctx.quadraticCurveTo(p1.x, p1.y, x1, y1)
      this.ctx.stroke()
    }

    // draw shape numbers
    // const p = this.points[this.points.length - 1]
    // this.ctx.font = '20px sans-serif'
    // this.ctx.fillStyle = 'rgb(255,255,255)'
    // this.ctx.fillText('' + this.index, p.x + 5, p.y + 5)

    this.drawn = j
  }

  _getWidth(t: number): number {
    return 0.5 + this._3rdPowerPoly(t) * this.width
  }

  _parabola(t: number): number {
    return t * (1 - t) * 4
  }

  _3rdPowerPoly(t: number): number {
    return t * (1 - t) * (1 + t) * 2.7
  }

  // mirror(): Shape {
  //   const points = this.points.map((p) => ({ ...p, x: 2 * this.size.cx - p.x }))
  //   const shape = new Shape(points, this.width)
  //   shape.ctx = this.ctx
  //   shape.size = this.size
  //   return shape
  // }
}

export default class SvgPathAnimation {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  parentElement: HTMLDivElement
  shapesconfig = []
  aspect = 0.7

  time = { start: Date.now(), current: 0, duration: 3 }
  size = { w: 0, h: 0, cx: 0, cy: 0 }

  shapes: Array<Shape> = []

  transform = { scale: 0.3 }
  animId = 0

  constructor(
    el: HTMLDivElement,
    svgfile: string,
    options: { shapesconfig: TShapesConfig }
  ) {
    this.parentElement = el
    this.canvas = document.createElement(`canvas`)
    this.parentElement.appendChild(this.canvas)
    this.canvas.id = 'logo-canvas'
    this.ctx = this.canvas.getContext('2d')
    this.shapesconfig = options.shapesconfig

    // let res = this.shapesconfig.map((el) => {
    //   const ret = { ...el, end: el.start + el.duration }
    //   delete ret.duration
    //   return ret
    // })
    // console.log('this.shapesconfig', JSON.stringify(res))

    this._handleResize()

    window.addEventListener(`resize`, () => {
      this._resetTime()
      this._clearCanvas()
      this._handleResize()
    })

    const svg = new SvgPath(svgfile, { shapesconfig: this.shapesconfig })
    const paths = svg.loadSvg()
    this.shapes = this._createShapes(paths)
  }

  _handleShapes():void {
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

  _handleResize():void {
    this.size.w = this.canvas.width = this.parentElement.clientWidth
    this.size.h = this.canvas.height = this.parentElement.clientWidth * this.aspect

    this.size.cx = this.size.w / 2
    this.size.cy = this.size.h / 2
  }

  _createShapes(paths):Array<Shape> {
    const bounds = this._getBounds(
      paths.reduce((acc: IPath, cur: IPath) => [...acc, ...cur], [])
    )

    this._calculateScale(bounds)
    paths = paths.map((path: IPath) =>
      path.map(this._transformPoint.bind(this))
    )

    const s = paths.map((points: IPath, index: number) => {
      const { width } = this.shapesconfig[index]
      const shape = new Shape(points, (1.2 * width) / this.transform.scale)
      shape.ctx = this.ctx
      shape.size = this.size
      return shape
    })

    return s;
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

  _calculateScale(bounds: IBounds): void {
    this.transform.scale =
      Math.max(
        bounds.width / this.canvas.width,
        bounds.height / this.canvas.height
      ) * .8
  }

  _transformPoint(p: IPoint): IPoint {
    return {
      ...p,
      x: 0 + p.x / this.transform.scale - 60,
      y: 0 + p.y / this.transform.scale + 30,
    }
  }

  _clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.size.w, this.size.h)
  }

  _handleTime(): boolean {
    this.time.current = (Date.now() - this.time.start) / 1000.0
    if (this.time.current > this.time.duration) {
      const event = new Event('logo-animation-end')
      this.canvas.dispatchEvent(event)
      window.cancelAnimationFrame(this.animId)
      return true
    }
    return false
  }

  _resetTime(): void {
    this.time.start = Date.now()
    this.time.current = (Date.now() - this.time.start) / 1000.0
  }

  animate(): void {
    const end = this._handleTime()
    this._clearCanvas()
    this._handleShapes()
    if (!end) {
      this.animId = window.requestAnimationFrame(this.animate.bind(this))
    }
  }

  start():Promise<null> {
    return new Promise((resolve) => {
      this._resetTime()
      this.animate()
      this.canvas.addEventListener('logo-animation-end', () => {
        resolve(null)
      })
    })
  }
}
