import { mapclamp } from 'ts/lib/lib'
import { easeOutCubic, easeInOutSquare, easeInSquare } from 'ts/lib/easing-functions'

function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val
}

// TODO: change from frame count to real time

interface transition {
  func: (x: number) => void
  page: number
}

interface state {
  from: number
  to: number
  val: number
  page: number
  setter: (x: number) => void
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
  states: Array<state> = []
  pageCount = 3
  currentPage = 0

  _scrollValue = 0 // refactor to 0 - 1
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

  get pageValue(): number {
    const value = this._scrollValue - this.currentPage
    if (this._lastPage < this.currentPage) {
      return easeInSquare(value)
    } else {
      return easeOutSquare(value)
    }
  }

  addTransition(transition: transition): void {
    this.transitions.push(transition)
  }

  addState(state: state): void {
    this.states.push(state)
  }

  handleCallbacks(): void {
    this.handleTransitions()
    this.handleStates()
  }

  handleTransitions(): void {
    this.transitions.forEach((cb) => {
      if (this.currentPage === cb.page) {
        cb.func(this.pageValue)
      }
    })
  }

  handleStates(): void {
    this.states.forEach((el) => {
      let value = 0
      if (el.page == this.currentPage) {
        value = el.to * this.pageValue + (1 - this.pageValue) * el.val
        el.setter(value)
      } else if (el.page === this.currentPage - 1) {
        value = this.pageValue * el.val + el.from * (1 - this.pageValue)
        el.setter(value)
      }
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

  onCooldown(): void {
    const rounded = Math.round(this._scrollValue)
    const THRESHOLD = 0.01
    if (Math.abs(rounded - this._scrollValue) > THRESHOLD) {
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

    this.animation.startScrollValue = this._scrollValue
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
    this._scrollValue =
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
