/*
  Base class
*/

export type TransitionCallback = (el: HTMLElement, value: number) => void

export class TransitionBase {
  el: HTMLElement | null = null
  lastFrame: number = -1
  lastValue = -1

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

  init() {}

  update() {}
}
