import { mapclamp } from 'ts/lib/lib'
import {
  easeOutCubic,
  // easeInOutQuint,
  // easeInOutQuad,
  // easeOutBack,
} from 'ts/lib/easing-functions'

function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val
}

// TODO: change from frame count to real time

interface callback {
  func: (x: number) => void
  from: number
  to: number
}

export default class ScrollTimeline {
  COOLDOWN_TIMEOUT = 100
  ANIM_FRAMES = 20

  EASING_FUNCTION = easeOutCubic

  scrollValue = 0
  scrollStep = 8
  maxScrollValue = 1000

  callbacks: Array<callback> = []
  elements = []

  cooldownTimeout = null
  animId = null
  boundElementProperties = {}

  animation = {
    startScrollValue: 0,
    targetScrollValue: 0,
  }

  animationFrames = {
    current: 0,
    start: 0,
    end: this.ANIM_FRAMES,
  }

  snaps = []

  constructor(options) {
    this.scrollStep = options.scrollStep
    this.maxScrollValue = options.maxScrollValue
    this.snaps = options.snaps
  }

  addCallback(
    func: (x: number) => void,
    options: {
      from: number
      to: number
    }
  ): void {
    const callback = {
      func: func,
      from: 0,
      to: this.maxScrollValue,
      ...options,
    }
    this.callbacks.push(callback)
  }

  handleCallbacks(): void {
    this.callbacks.forEach((callback) => {
      if (this.scrollValue < callback.from || this.scrollValue > callback.to) {
        return
      }
      callback.func(
        (this.scrollValue - callback.from) / (callback.to - callback.from)
      )
    })
  }

  addElement(selector, property, units, options): void {
    let elements = document.querySelectorAll(selector)
    let e = {
      elements,
      property,
      units,
      start: 0,
      end: 0,
      from: this.maxScrollValue,
      to: 1,
      ...options,
    }
    this.elements.push(e)
  }

  handleElements(): void {
    this.elements.forEach((e) => {
      e.elements.forEach((e1) => {
        if (this.scrollValue >= e.start && this.scrollValue <= e.end) {
          let value = mapclamp(this.scrollValue, e.start, e.end, e.from, e.to)
          e1.style[e.property] = `${value}${e.units}`
        }
      })
    })
  }

  start(): void {
    this.handleCallbacks()
    document.addEventListener('wheel', this.handleScroll.bind(this))
  }

  checkScrollBlocker(e): boolean {
    if (Array.isArray(e.path)) {
      return e.path.some((el) => {
        return el.classList?.contains('prevent-scroll')
      })
    }
    return false
  }

  handleScroll(e): void {
    if (this.checkScrollBlocker(e)) {
      return
    }

    const value = e.deltaY
    if (value > 0) {
      this.setScrollValue(this.animation.targetScrollValue + this.scrollStep)
    } else if (value < 0) {
      this.setScrollValue(this.animation.targetScrollValue - this.scrollStep)
    }
  }

  onCooldown() {
    const closest = this.findClosestSnapValue()
    if (Number.isFinite(closest)) {
      this.setScrollValue(closest)
    }
  }

  findClosestSnapValue() {
    let foundValue = Infinity
    this.snaps.forEach((snap) => {
      if (
        (this.scrollValue <= snap.value &&
          this.scrollValue > snap.value - snap.snapUnder) ||
        (this.scrollValue >= snap.value &&
          this.scrollValue <= snap.value + snap.snapOver)
      ) {
        foundValue = snap.value
      }
    })
    return Math.abs(foundValue - this.scrollValue) > 0.1 ? foundValue : Infinity
  }

  setCoolDownTimeout() {
    this.cooldownTimeout = window.setTimeout(() => {
      this.onCooldown()
    }, this.COOLDOWN_TIMEOUT)
  }

  clearCoolDownTimeout() {
    if (this.cooldownTimeout) {
      window.clearTimeout(this.cooldownTimeout)
      this.cooldownTimeout = null
    }
  }

  setScrollValue(value) {
    value = clamp(value, 0, this.maxScrollValue)

    this.animation.startScrollValue = this.scrollValue
    this.animation.targetScrollValue = value
    this.animationFrames.current = 0
    this.animationFrames.end =
      this.ANIM_FRAMES * this.scrollTimeGrowCoefficient()

    if (this.animId) {
      cancelAnimationFrame(this.animId)
    }

    this.clearCoolDownTimeout()
    this.animate()
  }

  scrollTimeGrowCoefficient() {
    return (
      1 +
      Math.abs(
        this.animation.targetScrollValue - this.animation.startScrollValue
      ) /
        this.scrollStep /
        2
    )
  }

  animate() {
    let t = this.EASING_FUNCTION(
      this.animationFrames.current / this.animationFrames.end
    )
    if (t > 0.99) {
      t = 1
    }
    this.scrollValue =
      this.animation.startScrollValue +
      (this.animation.targetScrollValue - this.animation.startScrollValue) * t

    this.animationFrames.current++
    if (this.animationFrames.current >= this.animationFrames.end) {
      this.setCoolDownTimeout()
      return
    }

    this.handleCallbacks()
    this.handleElements()

    this.animId = requestAnimationFrame(this.animate.bind(this))
  }
}
