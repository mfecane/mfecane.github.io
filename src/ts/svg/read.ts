import { parse } from 'svg-parser'
import parsePath from 'parse-svg-path'
import bezier from 'bezier-curve'
import { mapplain, dist } from 'ts/lib/lib'

interface IPoint {
  x: number
  y: number
  t: number
}

export default class SvgPath {
  shapesconfig = []
  data = null

  constructor(data, options) {
    this.data = data
    this.shapesconfig = options.shapesconfig
  }

  loadSvg() {
    const parsed = parse(this.data)
    let paths = this._parseSvg(parsed)

    paths = paths
      .filter((el) => el.length > 2)
      .map((path, index) => {
        path = path.map(this._decodeParsedPathsForBezier)
        path = this._subdivideCurves(path)
        path = this._remapTime(path)
        path = this._filterPointsByTime(path)
        path = this._tweakTime(path, index)
        return path
      })

    console.log(
      'points count',
      paths.reduce((acc, cur) => acc + cur.length, 0)
    )

    return paths
  }

  _parseSvg(parsed) {
    const paths = []
    parsed.children.forEach((el1) => {
      el1.children
        .filter((el3) => el3.tagName === 'path')
        .forEach((el3) => {
          paths.push(parsePath(el3.properties.d))
        })
    })
    return paths
  }

  _decodeParsedPathsForBezier(p) {
    const type = p[0]
    const data = p.slice(1)
    const points = []

    for (let i = 0; i < data.length; i += 2) {
      points.push([data[i], data[i + 1]])
    }

    return {
      type,
      points,
    }
  }

  _addAll(points, point) {
    return points.map((el) => [el[0] + point[0], el[1] + point[1]])
  }

  _mirrorPoint(p, o) {
    return [2 * o[0] - p[0], 2 * o[1] - p[1]]
  }

  _createFilteredBezier(bezierPoints) {
    let points = []
    let cur
    let bez = bezier(0, bezierPoints)
    let last = { x: bez[0], y: bez[1], d: 0 }
    points.push({ ...last, d: 0 })

    for (let t = 0; t < 1; t += 0.05) {
      bez = bezier(t, bezierPoints)
      cur = {
        x: bez[0],
        y: bez[1],
      }
      let d = dist(cur, last)

      if (d > 0.5) {
        points.push({ ...cur, d })
        last = cur
      }
    }
    return points
  }

  _subdivideCurves(paths) {
    let currentPoint = []
    let lastBezierPoint = []

    let points = []

    paths.forEach((p) => {
      let type = p.type
      let bezierPoints = p.points

      switch (type) {
        case 'M':
          currentPoint = bezierPoints[0]
          lastBezierPoint = bezierPoints[0]
          break
        case 's':
          bezierPoints = this._addAll(bezierPoints, currentPoint)
        case 'S':
          bezierPoints = [
            this._mirrorPoint(lastBezierPoint, currentPoint),
            ...bezierPoints,
          ]
          break
        case 'c':
          bezierPoints = this._addAll(bezierPoints, currentPoint)
        case 'C':
          bezierPoints = [currentPoint, ...bezierPoints]
          break
        default:
          throw new Error('Not implemented')
      }

      if (['s', 'S', 'c', 'C'].indexOf(type) !== -1) {
        currentPoint = bezierPoints[bezierPoints.length - 1]
        lastBezierPoint = bezierPoints[bezierPoints.length - 2]
        points = [...points, ...this._createFilteredBezier(bezierPoints)]
      }
    })

    return points
  }

  _remapTime(path) {
    const total = path.reduce((acc, cur) => acc + cur.d, 0)
    let dist = 0
    return path.map((el) => {
      dist += el.d
      return { x: el.x, y: el.y, t: dist / total }
    })
  }

  _tweakTime(path, index) {
    if (this.shapesconfig[index]) {
      const { start, end } = this.shapesconfig[index]
      return path.map((point) => this._tweakTimePoint(point, start, end))
    }
    return path
  }

  _tweakTimePoint(point, start, end) {
    return {
      ...point,
      t: start + point.t * (end - start),
    }
  }

  _filterPointsByTime(path) {
    const result = []
    let scale = dist(path[0], path[path.length - 1])
    // and scale
    // TODO: change to length
    scale = mapplain(scale, 20, 300, 0.2, 1.0)

    let ct = 0
    path.forEach((el) => {
      if (el.t >= ct) {
        result.push(el)
        // optimize by path scale
        let dt = 0.005 + 0.02 * this._parabola(el.t)
        dt /= scale
        ct += dt
      }
    })
    return result
  }

  _parabola(t: number) {
    return t * (1 - t) * 4
  }
}
