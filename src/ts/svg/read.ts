import { parse } from 'svg-parser'
import parsePath from 'parse-svg-path'
import bezier from 'bezier-curve'
import { mapplain, dist } from 'ts/lib/lib'

let shapesconfig

interface IPoint {
  x: number
  y: number
}

const loadSvg = function (data, sc) {
  const parsed = parse(data)
  let paths = _parseSvg(parsed)
  shapesconfig = sc

  paths = paths
    .filter((el) => el.length > 3)
    .map((path, index) => {
      path = path.map(_decodeParsedPathsForBezier)
      path = _subdivideCurves(path)
      path = _remapTime(path)
      path = _filterPointsByTime(path)
      path = _tweakTime(path, index)
      return path
    })

  console.log(
    'points count',
    paths.reduce((acc, cur) => acc + cur.length, 0)
  )

  return paths
}

const _parseSvg = function (parsed) {
  const paths = []
  parsed.children.forEach((el1) => {
    el1.children
      .filter((el2) => el2.tagName === 'g')
      .forEach((el2) => {
        el2.children
          .filter((el3) => el3.tagName === 'path')
          .forEach((el3) => {
            paths.push(parsePath(el3.properties.d))
          })
      })
  })
  return paths
}

const _decodeParsedPathsForBezier = function (p) {
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

const _addAll = function (points, point) {
  return points.map((el) => [el[0] + point[0], el[1] + point[1]])
}

const _mirrorPoint = function (p, o) {
  return [2 * o[0] - p[0], 2 * o[1] - p[1]]
}

const _createFilteredBezier = function (bezierPoints) {
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

const _subdivideCurves = function (paths) {
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
        bezierPoints = _addAll(bezierPoints, currentPoint)
      case 'S':
        bezierPoints = [
          _mirrorPoint(lastBezierPoint, currentPoint),
          ...bezierPoints,
        ]
        break
      case 'c':
        bezierPoints = _addAll(bezierPoints, currentPoint)
      case 'C':
        bezierPoints = [currentPoint, ...bezierPoints]
        break
      default:
        throw new Error('Not implemented')
    }

    if (['s', 'S', 'c', 'C'].indexOf(type) !== -1) {
      currentPoint = bezierPoints[bezierPoints.length - 1]
      lastBezierPoint = bezierPoints[bezierPoints.length - 2]
      points = [...points, ..._createFilteredBezier(bezierPoints)]
    }
  })

  return points
}

const _remapTime = function (path) {
  const total = path.reduce((acc, cur) => acc + cur.d, 0)
  let dist = 0
  return path.map((el) => {
    dist += el.d
    return { x: el.x, y: el.y, t: dist / total }
  })
}

const _tweakTime = function (path, index) {
  const { start, duration } = shapesconfig[index]
  return path.map((point) => _tweakTimePoint(point, start, duration))
}

const _tweakTimePoint = function (point, start, duration) {
  return {
    ...point,
    t: start + point.t * duration,
  }
}

const _filterPointsByTime = function (path) {
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
      let dt = 0.005 + 0.02 * _parabola(el.t)
      dt /= scale
      ct += dt
    }
  })
  return result
}

const _parabola = function (t) {
  return t * (1 - t) * 4
}

export default loadSvg
