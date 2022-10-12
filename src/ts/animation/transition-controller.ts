import {
  TransitionBase,
  TransitionCallback,
} from 'ts/animation/transition-base'
import scroller2 from 'ts/animation/scroller'

export interface ControllerOptions {
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

export class Controller extends TransitionBase {
  transitionIn: TransitionCallback = () => {}
  transitionOut: TransitionCallback = () => {}
  frames: [number, number, number, number]

  constructor(options: ControllerOptions) {
    super()
    this.el = options.el
    this.frames = options.frames

    if (options.index && options.offset) {
      this.frames = this.frames.map(
        (fr) => fr + options.index * options.offset
      ) as [number, number, number, number]
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
