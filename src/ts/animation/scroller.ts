let maxScrollValue = 1.0
let scrollValue = 0.0
let targetScrollValue = 0.0
let scrollStep = 0.5
let scrollSpeed = 0

const ACCELERATION = 0.08
const DRAG = 0.8

const points: Point[] = []

type Point = {
  value: number
  from?: number
  to?: number
}

type Options = {
  step: number
  points: Point[]
}

type Callback = (arg: number) => void

const listeners: Callback[] = []

let timeOut: NodeJS.Timeout = null

const STICKY_TIMEOUT = 500
const SCROLL_THRESHOLD = 5
const SCROLL_SPEED_THRESHOLD = 2

const init = function (options: Options): void {
  points.length = 0

  options.points.forEach((p) => {
    points.push(p)
  })

  maxScrollValue = points[points.length - 1].value
  scrollStep = options.step
  document.addEventListener('wheel', handleScroll)
}

const handleScroll = function (e) {
  const value = e.deltaY
  if (value > 0 && targetScrollValue < maxScrollValue) {
    targetScrollValue += scrollStep
  } else if (value < 0 && targetScrollValue > 0.0) {
    targetScrollValue -= scrollStep
  }
  setStickyTimeout()
}

const checkStickyPoints = function () {
  if (Math.abs(scrollSpeed) > SCROLL_SPEED_THRESHOLD) {
    setStickyTimeout()
    return
  }

  points.forEach((sp) => {
    if (sp.from < targetScrollValue && targetScrollValue <= sp.to) {
      targetScrollValue = sp.value
    }
  })
}

const setStickyTimeout = function () {
  if (timeOut) {
    clearTimeout(timeOut)
    timeOut = null
  }

  timeOut = setTimeout(checkStickyPoints, STICKY_TIMEOUT)
  return
}

const update = function (): void {
  if (Math.abs(scrollValue - targetScrollValue) < SCROLL_THRESHOLD) {
    scrollSpeed = 0
    updateScrollValue(targetScrollValue)
    return
  }
  const accel =
    (targetScrollValue - scrollValue) * ACCELERATION - scrollSpeed * DRAG + 2
  scrollSpeed += accel
  updateScrollValue(scrollValue + scrollSpeed)
}

const updateScrollValue = function (value: number): void {
  scrollValue = value
  listeners.forEach((cb) => cb(value))
}

const getScrollValue = function (): number {
  return scrollValue
}

const setScrollValue = function (value: number): void {
  targetScrollValue = value
}

const addListener = (callback: Callback): void => {
  listeners.push(callback)
}

export default {
  init,
  update,
  getScrollValue,
  setScrollValue,
  addListener,
}
