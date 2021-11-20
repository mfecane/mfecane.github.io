import ScrollTimeline from 'ts/animation/scroll-pager'
import {
  easeInSquare,
  easeOutBack,
  easeOutSquare,
} from 'ts/lib/easing-functions'
import { mapclamp, mapplain } from 'ts/lib/lib'

interface ScrollTimeLineElement {
  element: HTMLElement
  page: number
  transitionIn: string
  transitionOut: string
  argsIn: Array<string>
  argsOut: Array<string>
}

const transitions = [
  {
    code: 'slide-from',
    callback: (el: ScrollTimeLineElement, value: number, args: Array<string>) => {
      const [from = 'left', fromValue = '200', delay = '1'] = args
      const dir = from === 'right' ? 1 : -1

      if (delay) {
        value = 1 - (1 - value * +delay)
      }

      const val1 = mapclamp(easeOutSquare(value), 0.7, 1, +fromValue * dir, 0)
      el.element.style.transform = `translateX(${val1}px)`

      const val2 = mapclamp(easeOutSquare(value), 0.7, 1, 0, 1)
      el.element.style.opacity = `${val2}`
    },
  },
  {
    code: 'second-page-left',
    callback: (el: ScrollTimeLineElement, value: number) => {
      const val = easeOutSquare(value)
      const val8 = mapclamp(val, 0.5, 0.9, -el.element.offsetWidth, 0)
      el.element.style.transform = `translateX(${val8}px)`
    },
  },
  {
    code: 'second-page-right',
    callback: (el: ScrollTimeLineElement, value: number) => {
      console.log(value)
      const val = easeOutSquare(value)
      const val9 = mapplain(val, 0, 1, el.element.offsetWidth, 0)
      el.element.style.transform = `translateX(${val9}px)`

      const val2 = mapclamp(easeOutSquare(value), 0.7, 1, 0, 1)
      el.element.style.opacity = `${val2}`
    },
  },
]

export default class ScrollTimelineSetup {
  elements: Array<ScrollTimeLineElement> = []
  _scrollTimeline: ScrollTimeline = null

  set scrollTimeline(value: ScrollTimeline) {
    this._scrollTimeline = value
  }

  init(): void {
    const elementList = Array.from(
      document.querySelectorAll('[data-transition]')
    )
    this.elements = elementList.map((el: HTMLElement) => {
      const transitionInArgs = el.dataset.transitionInArgs || ''
      const transitionOutArgs = el.dataset.transitionOutArgs || ''

      return {
        element: el,
        page: +el.dataset.transitionPage,
        transitionIn: el.dataset.transitionIn,
        transitionOut: el.dataset.transitionOut,
        argsIn: transitionInArgs.split('|'),
        argsOut: transitionOutArgs.split('|'),
      }
    })
  }

  updateTitleFromTop(el: ScrollTimeLineElement, value: number): void {
    const val10 = mapplain(value, 0.7, 1, -100, 0)
    el.element.style.transform = `translateY(${val10}px)`
    const val11 = mapplain(value, 0.7, 1, 0, 1)
    el.element.style.opacity = `${val11}`
  }

  update(): void {
    // TODO refactor
    const [currentPage, value] = this._scrollTimeline.getScrollValueWithPage()
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
        let val = value
        let cb

        if (currentPage <= el.page - 1) {
          if (currentPage < el.page - 1) {
            val = 0
          }
          cb = transitions.find((cb) => {
            return cb.code === el.transitionIn
          })
          cb.callback(el, val, el.argsIn)
        }

        if (currentPage >= el.page) {
          if (currentPage > el.page) {
            val = 0
          }
          cb = transitions.find((cb) => {
            return cb.code === el.transitionOut
          })
          cb.callback(el, 1 - val, el.argsOut)
        }
      })
  }

  animate(): void {
    this.update()

    window.requestAnimationFrame(() => {
      this.animate()
    })
  }
}
