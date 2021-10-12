import { mapclamp } from 'ts/lib/lib'
import {
  easeOutCubic,
  easeOutSquare,
  easeInSquare,
} from 'ts/lib/easing-functions'

function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val
}

// TODO: change from frame count to real time

interface transition {
  func: (x: number) => void
  range: Array<number>
  mapping?: Array<number>
  value?: number | null
}

interface options {
  pageCount: number
  scrollStep: number
}

export default class ScrollTimeline {
  COOLDOWN_TIMEOUT = 100
  ANIM_FRAMES = 20

  EASING_FUNCTION = easeOutCubic

  scrollStep = 0.05

  transitions: Array<transition> = []
  pageCount = 3

  _scrollValue = 0 // refactor to 0 - 1
  _currentPage = 0
  _cooldownTimeout = null
  _animId = null
  _lastPage = -1

  animation = {
    startScrollValue: 0,
    targetScrollValue: 0,
  }

  animationFrames = {
    current: 0,
    start: 0,
    end: this.ANIM_FRAMES,
  }

  constructor(options: options) {
    this.pageCount = options.pageCount || this.pageCount
    this.scrollStep = options.scrollStep || this.scrollStep
  }

  set scrollValue(value: number) {
    this._scrollValue = value
    const tmp = this._currentPage
    this._currentPage = Math.floor(this._scrollValue)
    // TODO ::: dont update if equal

    if (tmp !== this._currentPage) {
      this._lastPage = tmp
    }
  }

  get scrollValue(): number {
    return this._scrollValue
  }

  addTransition(transition: transition): void {
    if (!transition.mapping) {
      transition.mapping = [0, 1]
    }
    this.transitions.push(transition)
  }

  handleCallbacks(): void {
    this.handleTransitions()
  }

  _inRange(range: Array<number>, value: number): boolean {
    return range[0] <= value && value <= range[1]
  }

  _mapValues(
    range: Array<number>,
    mapping: Array<number>,
    parameter: number
  ): number {
    if (parameter <= range[0]) {
      return mapping[0]
    }

    if (parameter >= range[1]) {
      return mapping[mapping.length - 1]
    }

    const intervalLength = (range[1] - range[0]) / (mapping.length - 1)
    const intervalIndex = Math.floor((parameter - range[0]) / intervalLength)
    const intervalValue = parameter % intervalLength

    const start = mapping[intervalIndex]
    const end = mapping[intervalIndex + 1]

    const result = start + ((end - start) * intervalValue) / intervalLength
    return result
  }

  handleTransitions(): void {
    this.transitions.forEach((tr) => {
      const value = this._mapValues(tr.range, tr.mapping, this.scrollValue)
      if (tr.value !== value) {
        tr.value = value
        tr.func(value)
      }
    })
  }

  initTransitions(): void {
    this.transitions.forEach((tr) => {
      tr.func(tr.mapping[0])
    })
  }

  start(): void {
    this.initTransitions()
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

  onCooldown(): void {
    const rounded = Math.round(this.scrollValue)
    const THRESHOLD = 0.01
    if (Math.abs(rounded - this.scrollValue) > THRESHOLD) {
      this.setScrollValue(rounded)
    }
  }

  setCoolDownTimeout(): void {
    this._cooldownTimeout = window.setTimeout(() => {
      this.onCooldown()
    }, this.COOLDOWN_TIMEOUT)
  }

  clearCoolDownTimeout(): void {
    if (this._cooldownTimeout) {
      window.clearTimeout(this._cooldownTimeout)
      this._cooldownTimeout = null
    }
  }

  setScrollValue(value: number): void {
    value = clamp(value, 0, this.pageCount)

    this.animation.startScrollValue = this.scrollValue
    this.animation.targetScrollValue = value
    this.animationFrames.current = 0
    this.animationFrames.end =
      this.ANIM_FRAMES * this.scrollTimeGrowCoefficient()

    if (this._animId) {
      cancelAnimationFrame(this._animId)
    }

    this.clearCoolDownTimeout()
    this.animate()
  }

  scrollTimeGrowCoefficient(): number {
    return (
      1 +
      Math.abs(
        this.animation.targetScrollValue - this.animation.startScrollValue
      ) /
        this.scrollStep /
        2
    )
  }

  animate(): void {
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

    this._animId = requestAnimationFrame(this.animate.bind(this))
  }
}
