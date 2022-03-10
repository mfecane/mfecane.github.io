import ScrollTimeline from 'ts/animation/scroll-pager'
import MainBgAnimation from 'ts/components/main-background'
import SvgPathAnimation from 'ts/components/svg-path-animation'
import { easeOutSquare } from 'ts/lib/easing-functions'

import mainLogo from 'assets/svg/svg-low.inline.svg'
import shapesconfig from 'ts/svg/shapes-config'

import floralPage2Svg from 'assets/svg/second-page-floral2.inline.svg'
import shapesconfig2 from 'ts/svg/shapes-config2'

import { mapclamp, mapplain, map01 } from 'ts/lib/lib'
import AnimColor from 'ts/components/anim-color'
import ScrollTimelineSetup from './components/scroll-timeline-setup'

import { initScroller, update, setScrollerOpacity } from 'ts/components/scroller'

let logoContainer: HTMLDivElement
let scrolltimeline: ScrollTimeline
let mouseContainer: HTMLDivElement
let logo: SvgPathAnimation
let mainBgAnimation: MainBgAnimation
let mainBgCanvasContainer: HTMLDivElement
let page1: HTMLDivElement
let page2: HTMLDivElement
let contactsLink: HTMLElement
let worksTitle: HTMLDivElement

let logoAnimationFinished = false

const firstTransition = (value) => {
  value = easeOutSquare(value)

  const val1 = map01(value, 0, (-window.innerWidth / 5) * 3 * 1)
  page1.style.transform = `translateX(${val1}px)`
  page1.style.visibility = value === 1 ? 'hidden' : 'visible'

  page2.style.visibility = value === 0 ? 'hidden' : 'visible'

  // TODO(AAl): this shouldn't happen each frame, check performance
  if (value > 0.1) {
    mouseContainer.classList.add('fade-out')
  } else {
    mouseContainer.classList.remove('fade-out')
  }

  setScrollerOpacity(mapclamp(value, 0.5, 1, 0, 0.7))

  if (logoAnimationFinished) {
    const v = mapclamp(value, 0, 0.6, 1, 0)
    logo.setFrame(v)
  }
}

const setUpMainLogoAnimation = () => {
  const config = {
    shapesconfig: shapesconfig2,
    scale: 0.5,
  }

  logo = new SvgPathAnimation(logoContainer, floralPage2Svg, config)
  logo.start().then(() => {
    logoAnimationFinished = true
  })
}

const desaturateInCallback = (value) => {
  const val1 = mapclamp(value, 0, 1, 0, 0.8)
  if (mainBgAnimation) {
    mainBgAnimation.desaturate(val1)
  }
}

const desaturateOutCallback = (value) => {
  desaturateInCallback(1 - value)
}

const worksTitleInCallback = (value) => {
  if (!worksTitle) {
    return
  }
  const val1 = mapclamp(easeOutSquare(value), 0, 1, -50, 5)
  worksTitle.style.left = `${val1}vw`
}

const worksTitleOutCallback = (value) => {
  if (!worksTitle) {
    return
  }
  const val1 = mapclamp(easeOutSquare(value), 0.2, 1, 5, -50)
  worksTitle.style.left = `${val1}vw`
}

// TODO ::: sell printer
// TODO ::: tablet
// TODO ::: fill linkedin

const setUpScrollTimeLine = () => {
  const options = {
    pages: [
      {
        step: 0.05,
        snap: true,
      },
      {
        step: 0.05,
        snap: true,
      },
      {
        step: 0.12,
        snap: true,
      },
      {
        step: 0.12,
        snap: true,
      },
      {
        step: 0.12,
        snap: true,
      },
      {
        step: 0.05,
        snap: true,
      },
    ],
  }

  scrolltimeline = new ScrollTimeline(options)

  scrolltimeline.addTransition({
    func: firstTransition,
    page: 0,
  })

  scrolltimeline.addTransition({
    func: desaturateInCallback,
    page: 0,
  })

  scrolltimeline.addTransition({
    func: desaturateOutCallback,
    page: options.pages.length - 1, // last page
  })

  scrolltimeline.addTransition({
    func: worksTitleInCallback,
    page: 1,
  })

  scrolltimeline.addTransition({
    func: worksTitleOutCallback,
    page: options.pages.length - 1, // last page
  })

  contactsLink.addEventListener('click', () => {
    scrolltimeline.setScrollValue(3)
  })

  mouseContainer.addEventListener('click', () => {
    scrolltimeline.setScrollValue(1)
  })

  scrolltimeline.addPageChangeCallback(
    update
  )

  scrolltimeline.start()
}

window.onload = () => {
  mainBgCanvasContainer = document.querySelector('#main-bg-canvas-container')
  logoContainer = document.querySelector('#logo-container')
  mouseContainer = document.querySelector('.mouse__container')
  contactsLink = document.querySelector('#contacts-link')
  page1 = document.querySelector('.page1')
  page2 = document.querySelector('.page2')
  worksTitle = document.querySelector('.works-title')

  window.setTimeout(() => {
    setUpMainLogoAnimation()
  }, 400)

  setUpScrollTimeLine()

  mainBgAnimation = new MainBgAnimation(mainBgCanvasContainer)
  mainBgAnimation.scrollTimeline = scrolltimeline
  mainBgAnimation.animate()

  const animColor = new AnimColor()
  animColor.init()
  // animColor.animate()

  const scrollTimelineSetup = new ScrollTimelineSetup()
  scrollTimelineSetup.scrollTimeline = scrolltimeline
  scrollTimelineSetup.init()
  scrollTimelineSetup.animate()

  initScroller({
    callback: (page) => {
      scrolltimeline.setScrollValue(page)
    },
  })
}
