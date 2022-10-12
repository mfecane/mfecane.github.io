import scroller2 from 'ts/animation/scroller'
import { FullScreenTransition } from 'ts/animation/transition-full-screen'
import { TransitionBase } from 'ts/animation/transition-base'
import { ScreenTransition } from 'ts/animation/transition-screen'
import { ClassTransition } from 'ts/animation/transition-class'
import { TransitionSimple } from 'ts/animation/transition-simple'
import {
  Controller,
  ControllerOptions,
} from 'ts/animation/transition-controller'

class AnimationManager {
  animations: TransitionBase[] = []

  constructor() {}

  init() {
    this.animations.forEach((trans) => {
      trans.init()
    })
    scroller2.addListener(this.update.bind(this))
  }

  createScreenTransition(options) {
    const nodeList = document.querySelectorAll(options.selector)
    Array.from(nodeList).forEach((node, index) => {
      options = { ...options, el: node, index: index }
      const transition = new ScreenTransition(options)
      transition.transitionIn(transition.el, 0)
      this.animations.push(transition)
    })
  }

  createFullScreenTransition(options) {
    const nodeList = document.querySelectorAll(options.selector)
    Array.from(nodeList).forEach((node, index) => {
      options = { ...options, el: node, index: index }
      const transition = new FullScreenTransition(options)
      transition.init()
      transition.transition(transition.el, 0)
      this.animations.push(transition)
    })
  }

  createClassTransition(options) {
    const nodeList = document.querySelectorAll(options.selector)
    Array.from(nodeList).forEach((node, index) => {
      options = { ...options, el: node, index: index }
      const transition = new ClassTransition(options)
      this.animations.push(transition)
    })
  }

  createAnimation(options) {
    const nodeList = document.querySelectorAll(options.selector)
    Array.from(nodeList).forEach((node) => {
      options = { ...options, el: node }
      const transition = new TransitionSimple(options)
      transition.init()
      this.animations.push(transition)
    })
  }

  createController = function (options: ControllerOptions): void {
    const nodeList = document.querySelectorAll(options.selector)
    Array.from(nodeList).forEach((node: HTMLElement, index) => {
      options = { ...options, el: node, index: index }
      const controller = new Controller(options)
      this.animations.push(controller)
    })
  }

  update() {
    this.animations.forEach((trans) => {
      trans.update()
    })
  }
}

export default new AnimationManager()
