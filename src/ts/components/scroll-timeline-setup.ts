import ScrollTimeline from 'ts/animation/scroll-pager'
import { easeInSquare, easeOutBack, easeOutSquare } from 'ts/lib/easing-functions'
import { mapclamp, mapplain } from 'ts/lib/lib'

interface ScrollTimeLineElement {
  element: HTMLElement
  type: string
  page: number
  data: any
}

const callbacks = [
  {
    code: 'slide-from',
    callback: (el: ScrollTimeLineElement, value: number) => {
      let dir = 1
      if(el.data?.animFrom === 'left') {
        dir = -1
      }

      const fromValue = el.data?.animFromValue || 200

      if(el.data?.animDelay) {
        value = 1 - (1 - value * el.data?.animDelay)
      }

      const val1 = mapclamp(easeOutSquare(value), 0.7, 1, fromValue * dir, 0)
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
      const val = easeOutSquare(value)
      const val9 = mapplain(val, 0, 1, el.element.offsetWidth, 0)
      el.element.style.transform = `translateX(${val9}px)`
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
    const elementList = Array.from(document.querySelectorAll('.scroll-anim'))
    this.elements = elementList.map((el: HTMLElement) => {
      // TODO check type
      return {
        element: el,
        type: el.dataset.animType,
        page: +el.dataset.animPage,
        data: el.dataset
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
    const currentPage = Math.floor(this._scrollTimeline.scrollValue)
    const value = this._scrollTimeline.scrollValue - currentPage

    this.elements
      .filter((el) => {
        return (
          el.page === currentPage ||
          el.page === currentPage + 1 ||
          el.page === currentPage - 1
        )
      })
      .forEach((el) => {
        const cb = callbacks.find((cb) => {
          return cb.code === el.type
        }).callback
        if (el.page === currentPage - 1) {
          cb(el, 1)
        }
        if (el.page === currentPage) {
          cb(el, value)
        }
        if (el.page === currentPage + 1) {
          cb(el, 0)
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
