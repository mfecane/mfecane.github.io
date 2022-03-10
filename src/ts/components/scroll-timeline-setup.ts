import ScrollTimeline from 'ts/animation/scroll-pager'
import {
  easeInSquare,
  easeOutBack,
  easeOutCubic,
  easeOutSquare,
  easeInCubic,
} from 'ts/lib/easing-functions'
import { mapclamp, mapplain } from 'ts/lib/lib'

type TransitionCallback = (
  el: Transition,
  value: number,
  args: Array<string> | null
) => void

// TODO add state of element to data ; ready

/*

  Example

  <div
    data-transition
    data-transition-page="2"
    data-transition-in="transition-id"
    data-transition-in-args="value1|value2|value3"
    data-transition-out="transition-id"
    data-transition-out-args="value1|value2|value3"
  >
  </div>

  args is array if values

*/

// List of callbacks used by transition

const transitions = [
  {
    code: 'slide-from',
    callback: (
      el: Transition,
      value: number,
      args: Array<string> | null
    ): void => {
      const [from = 'left', fromValue = '200', delay = '1'] = args
      const dir = from === 'right' ? 1 : -1

      // TODO looks like a bullshit tweak this
      if (delay) {
        value = 1 - (1 - value) * +delay * +delay * +delay
      }
      1 - (1 - 0.9) * 0.8

      const val1 = mapclamp(easeOutSquare(value), 0.7, 1, +fromValue * dir, 0)
      el.element.style.transform = `translateX(${val1}px)`

      const val2 = mapclamp(easeInSquare(value), 0.2, 1, 0, 1)
      el.element.style.opacity = `${val2}`
    },
  },
  {
    code: 'second-page-left',
    callback: (el: Transition, value: number): void => {
      const val = easeOutSquare(value)
      const val8 = mapclamp(val, 0.5, 0.9, -el.element.offsetWidth, 0)
      el.element.style.transform = `translateX(${val8}px)`
    },
  },
  {
    code: 'second-page-right',
    callback: (el: Transition, value: number): void => {
      const val = easeOutSquare(value)
      const val9 = mapplain(val, 0, 1, el.element.offsetWidth, 0)
      el.element.style.transform = `translateX(${val9}px)`

      const val2 = mapclamp(val, 0.2, 1, 0, 1)
      el.element.style.opacity = `${val2}`
    },
  },
  {
    code: 'third-page',
    callback: (el: Transition, value: number): void => {
      let val = easeOutSquare(value)
      let scale = mapplain(val, 0, 1, 0.4, 1)
      let trans = mapplain(val, 0, 1, -el.element.offsetHeight, 0)
      let transform = `translate(${-el.element.offsetWidth}px, ${trans}px) `
      transform += `scale(${scale}, ${scale})`
      el.element.style.transform = transform

      val = easeInCubic(value)
      el.element.style.opacity = `${val}`
    },
  },
  {
    code: 'third-page-out',
    callback: (el: Transition, value: number): void => {
      let val = easeInSquare(value)
      let trans = mapplain(
        val,
        1,
        0,
        -el.element.offsetWidth,
        -el.element.offsetWidth - 200
      )
      el.element.style.transform = `translateX(${trans}px)`
    },
  },
  {
    code: 'works-in',
    callback: (el: Transition, value: number): void => {
      const val = easeOutSquare(value)
      const val8 = mapclamp(val, 0.5, 0.9, -150, -50)
      el.element.style.transform = `translate(-35%, ${val8}%)`

      const val2 = mapclamp(val, 0.5, 0.95, 0, 1)
      el.element.style.opacity = `${val2}`
    },
  },
  {
    code: 'works-out',
    callback: (el: Transition, value: number): void => {
      const val = easeOutSquare(value)
      const val8 = mapclamp(val, 0.5, 0.9, 50, -50)
      el.element.style.transform = `translate(-35%, ${val8}%)`

      const val2 = mapclamp(val, 0.3, 0.9, 0, 1)
      el.element.style.opacity = `${val2}`
    },
  },
  {
    code: 'contacts-page',
    callback: (el: Transition, value: number): void => {
      let val = easeOutSquare(value)
      let trans = mapplain(val, 0, 1, 0, -el.element.offsetWidth)
      el.element.style.transform = `translateX(${trans}px)`
    },
  },
]

// Transition object is constructed for each element with transition on the page
// declarative approach is used

class Transition {
  currentValue = -1
  currentPage = -1
  element: HTMLElement
  page: number
  transitionIn: TransitionCallback
  transitionOut: TransitionCallback
  args: Array<string>
  argsIn: Array<string>
  argsOut: Array<string>

  constructor(el: HTMLElement) {
    this.element = el
    this.page = +el.dataset.transitionPage

    if (el.dataset.transition) {
      this.transitionIn = this.findTransition(el.dataset.transition)
      this.transitionOut = this.transitionIn

      this.argsIn = (el.dataset.transitionArgs || '').split('|')
      this.argsOut = this.argsIn
    }

    if (el.dataset.transitionIn) {
      this.transitionIn = this.findTransition(el.dataset.transitionIn)
      this.argsIn = (el.dataset.transitionInArgs || '').split('|')
    }

    if (el.dataset.transitionOut) {
      this.transitionOut = this.findTransition(el.dataset.transitionOut)
      this.argsOut = (el.dataset.transitionOutArgs || '').split('|')
    }
  }

  findTransition(transition) {
    return transitions.find((cb) => {
      return cb.code === transition
    }).callback
  }

  update(page, value) {
    if (this.currentValue === value && this.currentPage === page) {
      return
    }

    this.currentValue = value
    this.currentPage = page

    let val = value

    if (page <= this.page - 1) {
      if (page < this.page - 1) {
        val = 0
        return
      }
      this.checkDisplay(val)
      return this.transitionIn(this, val, this.argsIn)
    }

    if (page >= this.page) {
      val = 1 - value
      if (page > this.page) {
        val = 0
        return
      }
      this.checkDisplay(val)
      return this.transitionOut(this, val, this.argsOut)
    }
  }

  checkDisplay(value) {
    if (value === 0) {
      this.element.style.visibility = 'hidden'
      return
    }
    this.element.style.visibility = 'visible'
  }
}

export default class ScrollTimelineSetup {
  elements: Array<Transition> = []
  _scrollTimeline: ScrollTimeline = null

  set scrollTimeline(value: ScrollTimeline) {
    this._scrollTimeline = value
  }

  init(): void {
    const elementList = Array.from(
      document.querySelectorAll('[data-transition]')
    )
    this.elements = elementList.map((el: HTMLElement) => {
      return new Transition(el)
    })
  }

  update(): void {
    // TODO refactor
    const [page, value] = this._scrollTimeline.getScrollValueWithPage()
    // TODO create filter
    // TODO fix page numbering
    // TODO cache value
    this.elements
      // .filter((el) => {
      //   return (
      //     el.page === currentPage ||
      //     el.page === currentPage + 1 ||
      //     el.page === currentPage - 1
      //   )
      // })
      .forEach((el) => {
        if (Math.abs(el.page - page) > 1 ) {
          el.element.style.visibility = 'hidden'
          return
        }

        el.element.style.visibility = 'visible'
        el.update(page, value)
      })
  }

  animate(): void {
    this.update()

    window.requestAnimationFrame(() => {
      this.animate()
    })
  }
}
