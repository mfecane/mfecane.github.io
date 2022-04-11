import scroller2 from 'ts/animation/scroller2'
import Transition from 'ts/components/transitions'

const FROM = 600
const TO = 3200
let scrollValue = 0

// let worksSectionBackgound: HTMLDivElement
let worksSection: HTMLDivElement
let workSectionTransition: () => void

let display = true

const updatebackground = function (el: HTMLElement, value: number): void {
  el.style.height = `${value * 500}px`
}

const init = function (): void {
  // worksSectionBackgound = document.querySelector('.works-section__background')
  worksSection = document.querySelector('.works-section')
  // worksSectionBackgound.style.height = '0px'

  // workSectionTransition = Transition({
  //   el: worksSectionBackgound,
  //   frames: [FROM, FROM + 300, TO - 300, TO],
  //   fn: updatebackground,
  // })
}

const toggleDisplay = function (d: boolean): void {
  if (d === display) {
    return
  }
  display = d

  if (display) {
    worksSection.style.visibility = 'visible'
  } else {
    worksSection.style.visibility = 'hidden'
  }
}

const transition = function (
  value: number,
  from: number,
  to: number,
  fn: (number) => void
): void {
  const min = Math.min(from, to)
  const max = Math.max(from, to)
  if (value >= min && value <= max) {
    fn((value - from) / (to - from))
  }
}

const update = function (): void {
  // scrollValue = scroller2.getScrollValue()
  // if (scrollValue < FROM || scrollValue > TO) {
  //   toggleDisplay(false)
  //   return
  // } else {
  //   toggleDisplay(true)
  // }
  // workSectionTransition()
}

export default { init, update }
