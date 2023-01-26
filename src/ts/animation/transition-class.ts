import { TransitionBase } from 'ts/animation/transition-base'

interface ClassTransitionOptions {
  selector: string
  el?: HTMLElement
  className?: string
  offset?: number
  offsetIn?: number
  offsetOut?: number
  index?: number
}

export class ClassTransition extends TransitionBase {
  el: HTMLElement
  className = 'active'
  offsetIn = 0
  offsetOut = null
  index = 0
  _active: boolean

  constructor(options: ClassTransitionOptions) {
    super()
    this.el = options.el
    this.className = options.className || this.className

    if (options.offset) {
      this.offsetIn = options.offset
      this.offsetOut = null
    }

    if (options.offsetIn && options.offsetOut) {
      this.offsetIn = options.offsetIn
      this.offsetOut = options.offsetOut
    }

    this.index = options.index || this.index
  }

  inti() {
    this.el.classList.toggle(this.className, this._active)
  }

  update() {
    const rect = this.el.getBoundingClientRect()
    let active = this._active

    active = true

    if (
      this.offsetIn &&
      rect.left + this.offsetIn * this.index > window.innerWidth
    ) {
      active = false
    }

    if (this.offsetOut && rect.right - this.offsetOut < 0) {
      active = false
    }

    if (this._active !== active) {
      this._active = active
      this.el.classList.toggle(this.className, this._active)
    }
  }
}
