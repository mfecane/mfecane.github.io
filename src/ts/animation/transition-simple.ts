import {
  TransitionBase,
  TransitionCallback,
} from 'ts/animation/transition-base'
import scroller2 from 'ts/animation/scroller'

interface Options {
  selector: string
  el?: HTMLElement
  start?: number
  end?: number
  back?: boolean
  init?: boolean
  hide?: boolean
  index?: number
  easing?: (value: number) => number
  fn: TransitionCallback
}

export class TransitionSimple extends TransitionBase {
  start: number
  end: number
  _init: boolean
  hide: boolean
  fn: TransitionCallback
  el: HTMLElement

  constructor(options: Options) {
    super()
    this.el = document.querySelector(options.selector)!
    if (!this.el) {
      throw new Error('Element not found by selector ' + options.selector)
    }

    this.start = options.start
    this.end = options.end
    this._init = options.init || false
    this.hide = options.hide || false

    if (options.fn) {
      this.fn = options.fn

      if (options.back) {
        this.fn = this._back(this.fn)
      }

      if (options.easing) {
        this.fn = this._addEasing(this.fn, options.easing)
      }
    }
  }

  init() {
    if (this._init) {
      this.fn(this.el, 0)
    }
  }

  update() {
    const frame = scroller2.getScrollValue()
    if (frame === this.lastFrame) {
      return
    }
    this.lastFrame = frame

    if (frame < this.start || frame > this.end) {
      if (this.hide) this.el.classList.toggle('hidden', true)
      return
    }
    if (this.hide) this.el.classList.toggle('hidden', false)

    const value = this._remap(frame, this.start, this.end)
    this.fn(this.el, value)
  }
}
