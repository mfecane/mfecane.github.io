import {
  TransitionBase,
  TransitionCallback,
} from 'ts/animation/transition-base'
import { mapplain } from '../lib/lib'

/*
  Transition based on element moving through screen fromleft to right
*/

export class FullScreenTransition extends TransitionBase {
  el: HTMLElement
  offset = 50
  index = 0
  start = -1
  end = -1
  transition: TransitionCallback

  constructor(options) {
    super()
    this.el = options.el
    this.offset = options.offset || this.offset
    this.index = options.index || this.index

    this.el = options.el

    if (options.transition) {
      this.transition = options.transition
    }

    if (options.easing) {
      this.transition = this._addEasing(this.transition, options.easing)
    }
  }

  init() {
    this.transition(this.el, 1)
    this.lastValue = 1
  }

  update() {
    const rect = this.el.getBoundingClientRect()
    const windowWidth = window.screen.width
    const rectLeft = rect.left
    const rectWidth = rect.width

    let t

    if (rectLeft < -rectWidth) {
      t = 1
    } else if (rectLeft > windowWidth) {
      t = 0
    } else {
      // rect.left is from (-element width) to window width
      t = mapplain(rectLeft, -rectWidth, windowWidth, 1, 0)
    }

    if (t === this.lastValue) {
      return
    }
    this.lastValue = t

    this.transition(this.el, t)
  }
}
