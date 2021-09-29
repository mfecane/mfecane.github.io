import SvgPathAnimation, {
  Shape,
  IPath,
  IPoint,
  IBounds,
} from 'ts/components/svg-path-animation'

export default class SecondPagePathAnimation extends SvgPathAnimation {
  _createShapes(paths) {
    const bounds = this._getBounds(
      paths.reduce((acc: IPath, cur: IPath) => [...acc, ...cur], [])
    )

    this._calculateScale(bounds)
    paths = paths.map((path: IPath) =>
      path.map(this._transformPoint.bind(this))
    )

    const s = paths.map((points: IPath, index: number) => {
      const { width } = this?.shapesconfig[index] || { width: 5 }
      const shape = new Shape(points, (1.2 * width) / this.transform.scale)
      shape.ctx = this.ctx
      shape.size = this.size
      shape.color = `rgb(27, 49, 71)`
      shape.index = index
      return shape
    })

    return s
  }

  _calculateScale(bounds: IBounds) {
    this.transform.scale =
      Math.min(
        (bounds.width * 1.2) / this.canvas.width,
        (bounds.height * 1.2) / this.canvas.height
      ) * 1.4
  }

  _transformPoint(p: IPoint) {
    return {
      ...p,
      x: -20 + p.x / this.transform.scale,
      y: p.y / this.transform.scale,
    }
  }

  _handleResize() {
    this.size.w = this.canvas.width = this.parentElement.clientWidth
    this.size.h = this.canvas.height = this.parentElement.clientHeight

    this.size.cx = this.size.w / 2
    this.size.cy = this.size.h / 2
  }
}
