import Spline from 'cubic-spline'
import { dist, mapclamp } from 'ts/lib/lib'

const PATH_RESOLUTION = 100

const smoothShapes = function (shapes) {
  return shapes.map((shape) => smoothShape(shape))
}

const smoothShape = function (shape) {
  const length = shape.length
  let xs = shape.map((el) => el.x)
  let ys = shape.map((el) => el.y)

  let current = 0
  let ts = shape.reduce((acc, cur, index, arr) => {
    if (index > 0) {
      current += dist(cur, arr[index - 1])
    }
    acc.push(current)
    return acc
  }, [])
  let maxlen = ts[ts.length - 1]

  ;(el, index) => {
    return (PATH_RESOLUTION / length) * index
  }
  const splineX = new Spline(ts, xs)
  const splineY = new Spline(ts, ys)
  const arr = Array(PATH_RESOLUTION).fill(null)
  return arr.map((el, index) => {
    let t = mapclamp(index, 0, PATH_RESOLUTION, 0, maxlen)
    return { x: splineX.at(t), y: splineY.at(t) }
  })
}

export default smoothShapes
