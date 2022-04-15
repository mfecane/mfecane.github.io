import scroller2 from 'ts/animation/scroller'
import { easeOutCubic } from 'ts/lib/easing-functions'

const animations: AnimationBase[] = []

export type TransitionCallback = (el: HTMLElement, value: number) => void

interface Options {
  selector?: string
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

interface ControllerOptions {
  selector?: string
  el?: HTMLElement
  index?: number
  offset?: number
  frames: [number, number, number, number]
  easing?: (value: number) => number
  transition?: TransitionCallback
  transitionIn?: TransitionCallback
  transitionOut?: TransitionCallback
}

class AnimationBase {
  el: HTMLElement
  lastFrame: number

  constructor() {
    // throw new Error('abstract class')
  }

  _back(
    fn: (el: Element, arg: number) => void
  ): (el: Element, arg: number) => void {
    return function (el, value) {
      return fn(el, 1 - value)
    }
  }

  _remap(value: number, start: number, end: number): number {
    if (value < start) return 0
    if (value > end) return 1

    return (value - start) / (end - start)
  }

  _addEasing(
    fn: (el: Element, arg: number) => void,
    easing: (x: number) => number
  ): (el: Element, arg: number) => void {
    return function (el, value) {
      return fn(el, easing(value))
    }
  }
}

class Controller extends AnimationBase {
  transitionIn: TransitionCallback = () => {}
  transitionOut: TransitionCallback = () => {}
  frames: [number, number, number, number]

  constructor(options: ControllerOptions) {
    super()
    this.el = options.el
    this.frames = options.frames

    if (options.index && options.offset) {
      this.frames = this.frames.map((fr) => fr + options.index * options.offset)
    }

    if (options.transition) {
      this.transitionIn = options.transition
      this.transitionOut = this._back(options.transition)
    }

    if (options.transitionIn) {
      this.transitionIn = options.transitionIn
    }

    if (options.transitionOut) {
      this.transitionOut = this._back(options.transitionOut)
    }

    if (options.transitionIn && options.easing) {
      this.transitionIn = this._addEasing(this.transitionIn, options.easing)
    }

    if (options.transitionOut && options.easing) {
      this.transitionOut = this._addEasing(this.transitionOut, options.easing)
    }
  }

  update() {
    const frame = scroller2.getScrollValue()
    if (frame === this.lastFrame) {
      return false
    }

    if (this.lastFrame < this.frames[0] || this.lastFrame > this.frames[3]) {
      // this.el.classList.toggle('hidden', true)
    } else {
      // this.el.classList.toggle('hidden', false)

      if (this.lastFrame > this.frames[0] && this.lastFrame < this.frames[1]) {
        const value = this._remap(frame, this.frames[0], this.frames[1])
        this.transitionIn(this.el, value)
      }

      if (this.lastFrame > this.frames[2] && this.lastFrame < this.frames[3]) {
        const value = this._remap(frame, this.frames[2], this.frames[3])
        this.transitionOut(this.el, value)
      }
    }

    this.lastFrame = frame
  }
}

class Transition extends AnimationBase {
  start: number
  end: number
  _init: boolean
  hide: boolean
  fn: TransitionCallback

  constructor(options: Options) {
    super()
    this.el = document.querySelector(options.selector)
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

interface ScreenTransitionOptions {
  el?: HTMLElement
  selector?: string
  offset?: number
  index?: number
  margin?: number
  transition?: TransitionCallback
  transitionIn?: TransitionCallback
  transitionOut?: TransitionCallback
}

class ScreenTransition extends AnimationBase {
  el: HTMLElement
  offset = 50
  margin = 200
  index = 0
  transitionIn: TransitionCallback
  transitionOut: TransitionCallback

  constructor(options) {
    super()
    this.el = options.el
    this.offset = options.offset || this.offset
    this.margin = options.margin || this.margin
    this.index = options.index || this.index

    this.el = options.el

    if (options.transition) {
      this.transitionIn = options.transition
      this.transitionOut = options.transition
    }

    if (options.transitionIn && options.transitionOut) {
      this.transitionIn = options.transitionIn
      this.transitionOut = options.transitionOut
    }

    if (options.easing) {
      this.transitionIn = this._addEasing(this.transitionIn, options.easing)
    }

    if (options.easing) {
      this.transitionOut = this._addEasing(this.transitionOut, options.easing)
    }
  }

  update() {
    const rect = this.el.getBoundingClientRect()

    let offsetReft = window.screen.width - (rect.left + rect.width / 2)
    let offsetLeft = rect.left + rect.width / 2

    if (this.offset && this.index) {
      offsetReft -= 50 * this.index
      offsetLeft -= 50 * this.index
    }

    if (offsetLeft < -rect.width / 2 || offsetReft < -rect.width / 2) {
      return
    }

    if (offsetReft < this.margin) {
      this.transitionIn(this.el, offsetReft / this.margin)
    }

    if (offsetLeft < this.margin) {
      this.transitionOut(this.el, offsetLeft / this.margin)
    }
  }
}

const update = function (): void {
  animations.forEach((trans: Transition) => {
    trans.update()
  })
}

const createAnimation = function (options: Options): void {
  const nodeList = document.querySelectorAll(options.selector)
  Array.from(nodeList).forEach(function (node) {
    options = { ...options, el: node }
    const transition = new Transition(options)
    transition.init()
    animations.push(transition)
  })
}

const createController = function (options: ControllerOptions): void {
  const nodeList = document.querySelectorAll(options.selector)
  Array.from(nodeList).forEach(function (node, index) {
    options = { ...options, el: node, index: index }
    const controller = new Controller(options)
    animations.push(controller)
  })
}

const createScreenTransition = (options: ScreenTransitionOptions): void => {
  const nodeList = document.querySelectorAll(options.selector)
  Array.from(nodeList).forEach(function (node, index) {
    options = { ...options, el: node, index: index }
    const transition = new ScreenTransition(options)
    transition.transitionIn(transition.el, 0)
    animations.push(transition)
  })
}

const fadeScaleIn = (el: HTMLElement, value: number) => {
  const val = (0.9 + value * 0.1) * 100
  el.style.transform = `scaleY(${val}%)`
  const val1 = easeOutCubic(value)
  el.style.opacity = `${val1}`
}

export default {
  createAnimation: createAnimation,
  createController: createController,
  createScreenTransition: createScreenTransition,
  update: update,
  fadeScaleIn: fadeScaleIn,
}
