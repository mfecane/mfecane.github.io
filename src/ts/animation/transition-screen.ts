import {
  TransitionBase,
  TransitionCallback,
} from 'ts/animation/transition-base'

interface ScreenTransitionOptions {
  el: HTMLElement | null
  selector?: string
  offset?: number
  index?: number
  margin?: number
  easing?: (value: number) => number
  transition?: TransitionCallback
  transitionIn?: TransitionCallback
  transitionOut?: TransitionCallback
}

/*
  Transition based on element becoming visible on screen
*/

export class ScreenTransition extends TransitionBase {
  el: HTMLElement
  offset = 50
  margin = 200
  index = 0
  transitionIn: TransitionCallback
  transitionOut: TransitionCallback
  lastValue = -1

  constructor(options: ScreenTransitionOptions) {
    super()
    this.el = options.el!
    this.offset = options.offset || this.offset
    this.margin = options.margin || this.margin
    this.index = options.index || this.index

    this.el = options.el!

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
    let t = -1
    // from the center of the element to right edge
    let offsetRight = window.screen.width - (rect.left + rect.width / 2)
    // from the center of the element to left edge
    let offsetLeft = rect.left + rect.width / 2

    if (this.offset && this.index) {
      offsetRight -= this.offset * this.index
      offsetLeft -= this.offset * this.index
    }

    t = 0
    // transition in -1 >> 0
    // transition out 0 >> 1
    if (offsetRight < 0) {
      t = -1
    } else if (offsetLeft < 0) {
      t = 1
    } else if (offsetRight < this.margin) {
      t = offsetRight / this.margin - 1
    } else if (offsetLeft < this.margin) {
      t = 1 - offsetLeft / this.margin
    }

    if (t === this.lastValue) {
      return
    }
    this.lastValue = t

    if (t <= 0) {
      this.transitionIn(this.el, 1 + t)
    } else if (t > 0) {
      this.transitionOut(this.el, t)
    }
  }
}
