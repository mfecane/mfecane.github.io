import { throttle } from 'lodash'

let maxScrollValue = 1.0
let scrollValue = 0.0
let targetScrollValue = 0.0
let scrollStep = 0.9
let scrollSpeed = 0

const SPEED_FACTOR = 0.12
const SMALL_DELTA = 5
const SMALL_SPEED = 2

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
const SCROLL_SPEED_THRESHOLD = 2

const init = function (options: Options): void {
  points.length = 0

  options.points.forEach((p) => {
    points.push(p)
  })

  maxScrollValue = points[points.length - 1].value
  scrollStep = options.step

  window.addEventListener('mousedown', mouseDownHandler)
  document.addEventListener('mousemove', throttle(mouseMoveHandlerDefault, 200))
  document.addEventListener('wheel', handleScroll)
}

let startDragScrollValue = 0
let startDrag = 0

let grabbingElement: HTMLElement = null

const mouseDownHandler = (e: MouseEvent) => {
  const el = e.target as HTMLDivElement

  if (!el.classList.contains('draggable')) return

  e.preventDefault()
  e.stopPropagation()

  startDrag = e.clientX
  startDragScrollValue = targetScrollValue
  grabbingElement = e.target as HTMLElement

  grabbingElement.style.cursor = 'grabbing'

  document.addEventListener('mousemove', mouseMoveHandlerGrabbing)
  document.addEventListener('mouseup', mouseUpHandler)
}

const mouseMoveHandlerGrabbing = throttle((e: MouseEvent) => {
  if (!grabbingElement) return
  grabbingElement.style.cursor = 'grabbing'
  const dx = startDrag - e.clientX
  targetScrollValue = startDragScrollValue + dx * 2

  if (targetScrollValue > maxScrollValue) targetScrollValue = maxScrollValue

  if (targetScrollValue < 0) targetScrollValue = 0
}, 200)

const mouseMoveHandlerDefault = throttle((e: MouseEvent) => {
  const el = e.target as HTMLDivElement
  if (!el.classList.contains('draggable')) return
  el.style.cursor = 'grabbing'
}, 200)

const mouseUpHandler = () => {
  grabbingElement.style.cursor = 'unset'
  grabbingElement = null
  setStickyTimeout()
  document.removeEventListener('mousemove', mouseMoveHandlerGrabbing)
  document.removeEventListener('mouseup', mouseUpHandler)
  document.removeEventListener('mouseout', mouseUpHandler)
}

const destroy = (): void => {
  setScrollValue(0)
  document.removeEventListener('wheel', handleScroll)
}

const handleScroll = function (e) {
  const value = e.deltaY
  if (value > 0 && targetScrollValue < maxScrollValue) {
    targetScrollValue += scrollStep
  } else if (value < 0 && targetScrollValue > 0) {
    targetScrollValue -= scrollStep
  }
  if (targetScrollValue > maxScrollValue) {
    targetScrollValue = maxScrollValue
  }
  if (targetScrollValue < 0) {
    targetScrollValue = 0
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
  console.log('targetScrollValue', targetScrollValue)
  if (
    Math.abs(targetScrollValue - scrollValue) < SMALL_DELTA &&
    scrollSpeed < SMALL_SPEED
  ) {
    scrollSpeed = 0
    scrollValue = targetScrollValue
    runCallbacks()
  } else {
    // speed based on factor
    scrollSpeed = (targetScrollValue - scrollValue) * SPEED_FACTOR
    // ensure min speed
    scrollSpeed =
      (Math.abs(scrollSpeed) > 1 ? Math.abs(scrollSpeed) : 1) *
      Math.sign(scrollSpeed)

    scrollValue = scrollValue + scrollSpeed
    runCallbacks()
  }
}

const runCallbacks = function (): void {
  listeners.forEach((cb) => cb(scrollValue))
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
  destroy,
}
