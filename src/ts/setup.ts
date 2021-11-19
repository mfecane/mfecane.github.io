import ScrollTimeline from 'ts/animation/scroll-pager'
import MainBgAnimation from 'ts/components/main-background'
import SvgPathAnimation from 'ts/components/svg-path-animation'
import SvgPathAnimation2 from 'ts/components/svg-path-animation2'
import { easeOutSquare } from 'ts/lib/easing-functions'

import mainLogo from 'assets/svg/svg-low.inline.svg'
import shapesconfig from 'ts/svg/shapes-config'

import floralPage2Svg from 'assets/svg/second-page-floral2.inline.svg'
import shapesconfig2 from 'ts/svg/shapes-config2'

import { mapclamp, mapplain, map01 } from 'ts/lib/lib'
import AnimColor from 'ts/components/anim-color'
import ScrollTimelineSetup from './components/scroll-timeline-setup'

let logoContainer: HTMLDivElement
let scrolltimeline: ScrollTimeline
let mouseContainer: HTMLDivElement
let logo: SvgPathAnimation
let pagerIndicator: HTMLDivElement
let mainBgAnimation: MainBgAnimation
let scrollContainer: HTMLDivElement
let mainBgCanvasContainer: HTMLDivElement
let page1: HTMLDivElement
let page2: HTMLDivElement
let curtain: HTMLDivElement
let page1Photo: HTMLImageElement
let page2left: HTMLDivElement
let page2right: HTMLDivElement
let page2title: HTMLDivElement
let placeholderScroller: HTMLDivElement
let contacts: HTMLDivElement

let mainBgAnimatinoCompleteFlag = false

const firstTransition = (value) => {
  value = easeOutSquare(value)

  const val1 = map01(value, 0, (-window.innerWidth / 2) * 1)
  page1.style.transform = `translateX(${val1}px)`
  page1.style.visibility = value === 1 ? 'hidden' : 'visible'

  const val2 = map01(value, 0, -window.innerWidth / 4)
  mainBgCanvasContainer.style.transform = `translateX(${val2}px)`
  mainBgCanvasContainer.style.visibility = value === 1 ? 'hidden' : 'visible'

  page2.style.visibility = value === 0 ? 'hidden' : 'visible'

  // TODO(AAl): this shouldn't happen each frame, check performance
  if (value > 0.1) {
    mouseContainer.classList.add('fade-out')
  } else {
    mouseContainer.classList.remove('fade-out')
  }

  if (mainBgAnimatinoCompleteFlag) {
    const v = mapclamp(value, 0, 0.6, 1, 0)
    logo.setFrame(v)
  }
}

// const handleSecondPage = (value) => {
//   const val1 = map01(
//     value,
//     0,
//     -placeholderScroller.offsetHeight + page2right.offsetHeight
//   )
//   placeholderScroller.style.top = `${val1}px`
// }

const handleContacts = (value) => {
  const val1 = map01(
    value,
    window.innerWidth,
    0
  )
  contacts.style.left = `${val1}px`
}


const handleCurtain = (value) => {
  const left = mapclamp(value, 0, 0.5, 100, 0)
  const width = mapclamp(Math.abs(value - 1 / 2), 0, 1 / 2, 100, 0)
  curtain.style.width = `${width}vw`
  curtain.style.left = `${left}vw`
  curtain.style.visibility = 'hidden'
}

const setUpMainLogoAnimation = () => {
  const config = {
    shapesconfig: shapesconfig2,
    scale: 0.5,
  }

  logo = new SvgPathAnimation(logoContainer, floralPage2Svg, config)
  logo.start().then(() => {
    mainBgAnimatinoCompleteFlag = true
  })
}

window.onload = () => {
  scrollContainer = document.querySelector('.scroll-container')
  mainBgCanvasContainer = document.querySelector('#main-bg-canvas-container')
  logoContainer = document.querySelector('#logo-container')
  mouseContainer = document.querySelector('.mouse__container')
  pagerIndicator = document.querySelector('.pager__indicator')

  // page1
  page1 = document.querySelector('.page1')
  page1Photo = document.querySelector('.page1__photo')

  page2 = document.querySelector('.page2')
  curtain = document.querySelector('.curtain')
  page2left = document.querySelector('.page2-left')
  page2right = document.querySelector('.page2-right')
  page2title = document.querySelector('.about__title')
  placeholderScroller = document.querySelector('.placeholder-scroller')
  contacts = document.querySelector('.contacts');

  window.setTimeout(() => {
    setUpMainLogoAnimation()
  }, 400)

  mainBgAnimation = new MainBgAnimation(mainBgCanvasContainer)
  mainBgAnimation.start()

  const options = {
    pages: [
      {
        step: 0.05,
        snap: true,
      },
      {
        step: 0.1,
        snap: true,
      },
      {
        step: 0.1,
        snap: true,
      }
    ],
  }

  scrolltimeline = new ScrollTimeline(options)

  // scrolltimeline.addTransition({
  //   func: handleCurtain,
  //   page: 0,
  // })

  scrolltimeline.addTransition({
    func: firstTransition,
    page: 0,
  })

  // scrolltimeline.addTransition({
  //   func: handleSecondPage,
  //   page: 1,
  // })

  scrolltimeline.addTransition({
    func: handleContacts,
    page: 1,
  })

  // scrolltimeline.addCallback(handleSecondPageScroll, {
  //   segment: 1,
  // })

  // scrolltimeline.addCallback((value) => {
  //   const v = 5 + (130 * value) / 5
  //   pagerIndicator.style.left = `${v}px`
  // }, {})

  mouseContainer.addEventListener('click', () => {
    scrolltimeline.setScrollValue(1)
  })

  scrolltimeline.start()

  const animColor = new AnimColor()
  animColor.init()
  animColor.animate()

  const scrollTimelineSetup = new ScrollTimelineSetup();
  scrollTimelineSetup.scrollTimeline = scrolltimeline
  scrollTimelineSetup.init()
  scrollTimelineSetup.animate()
}
