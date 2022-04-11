import { TransitionCallback } from 'ts/animation/transition'

const transitions = []

interface Options {
  el?: Element
  selector?: string
  offset?: number
  index?: number
  margin?: number
  transition?: TransitionCallback
  transitionIn?: TransitionCallback
  transitionOut?: TransitionCallback
}

class Transition {
  el: Element
  offset = 50
  margin = 200
  index = 0
  transitionIn: TransitionCallback
  transitionOut: TransitionCallback

  constructor(options) {
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

  _back(
    fn: (el: Element, arg: number) => void
  ): (el: Element, arg: number) => void {
    return function (el, value) {
      return fn(el, 1 - value)
    }
  }

  _addEasing(
    fn: (el: Element, arg: number) => void,
    easing: (x: number) => number
  ): (el: Element, arg: number) => void {
    return function (el, value) {
      return fn(el, easing(value))
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

const addTransiton = (options: Options): void => {
  const nodeList = document.querySelectorAll(options.selector)
  Array.from(nodeList).forEach(function (node, index) {
    options = { ...options, el: node, index: index }
    const controller = new Transition(options)
    transitions.push(controller)
  })
}

const update = function (): void {
  transitions.forEach((trans: Transition) => {
    trans.update()
  })
}

export default {
  addTransiton,
  update,
}
