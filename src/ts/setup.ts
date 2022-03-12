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

import { initScene, setCameraOffset } from 'ts/components/portrait-scene'

import {
  initScroller,
  update,
  setScrollerOpacity,
} from 'ts/components/scroller'

let logoContainer: HTMLDivElement
let scrolltimeline: ScrollTimeline
let mouseContainer: HTMLDivElement
let logo: SvgPathAnimation
let mainBgAnimation: MainBgAnimation
let mainBgCanvasContainer: HTMLDivElement
let page1: HTMLDivElement
let page2: HTMLDivElement
let worksTitle: HTMLDivElement
let photoContainer: HTMLDivElement
let avatarImage: HTMLImageElement

let logoAnimationFinished = false

const DISPLAY_MODE = {
  ANIMATED: 0,
  STATIC: 1,
}

const firstTransition = (value) => {
  value = easeOutSquare(value)

  const val1 = map01(value, 0, (-window.innerWidth / 5) * 3 * 1)
  page1.style.transform = `translateX(${val1}px)`
  page1.style.visibility = value === 1 ? 'hidden' : 'visible'

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

const handleCameraCallback = (value)=>{
  const val = mapclamp(easeOutSquare(value), 0, 0.6, -0.2, 0.4)
  setCameraOffset(val)
}

// TODO ::: sell printer
// TODO ::: tablet
// TODO ::: fill linkedin

// prettier-ignore
const setUpScrollTimeLine = () => {
  const options = {
    pages: [
      { step: 0.05, snap: true, },
      { step: 0.05, snap: true, },
      { step: 0.12, snap: true, },
      { step: 0.12, snap: true, },
      { step: 0.12, snap: true, },
      { step: 0.05, snap: true, },
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

  scrolltimeline.addTransition({
    func: handleCameraCallback,
    page: 0,
  })

  mouseContainer.addEventListener('click', () => {
    scrolltimeline.setScrollValue(1)
  })

  scrolltimeline.addPageChangeCallback(update)

  scrolltimeline.start()
}

const setUpMenu = () => {
  // document.querySelector('#home-link').addEventListener('click', () => {
  //   scrolltimeline.setScrollValue(0)
  // })

  document.querySelector('#exp-link').addEventListener('click', () => {
    scrolltimeline.setScrollValue(1)
  })

  document.querySelector('#works-link').addEventListener('click', () => {
    scrolltimeline.setScrollValue(2)
  })

  document.querySelector('#contacts-link').addEventListener('click', () => {
    scrolltimeline.setScrollValue(7)
  })

  document.querySelector('#contacts-button').addEventListener('click', () => {
    scrolltimeline.setScrollValue(7)
  })
}

const checkBrowser = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  // TODO ::: restore this
  if (900 < width && 700 < height && height < width) {
    return DISPLAY_MODE.ANIMATED
  }

  return DISPLAY_MODE.STATIC
}

const setUpAnimationComponents = () => {
  mainBgCanvasContainer = document.querySelector('#main-bg-canvas-container')
  logoContainer = document.querySelector('#logo-container')
  mouseContainer = document.querySelector('.mouse__container')
  page1 = document.querySelector('.page1')
  page2 = document.querySelector('.page2')
  worksTitle = document.querySelector('.works-title')
  photoContainer = document.querySelector('.page1__photo-container')
  avatarImage = document.querySelector('.page1__photo')

  window.setTimeout(() => {
    setUpMainLogoAnimation()
  }, 400)

  setUpScrollTimeLine()
  setUpMenu()

  mainBgAnimation = new MainBgAnimation(mainBgCanvasContainer)
  mainBgAnimation.scrollTimeline = scrolltimeline
  mainBgAnimation.animate()

  const animColor = new AnimColor()
  animColor.init()
  animColor.animate()

  const scrollTimelineSetup = new ScrollTimelineSetup()
  scrollTimelineSetup.scrollTimeline = scrolltimeline
  scrollTimelineSetup.init()
  scrollTimelineSetup.animate()

  initScene().then((domElement) => {
    avatarImage.style.display = 'none'
    photoContainer.appendChild(domElement)
  })

  initScroller({
    callback: (page) => {
      scrolltimeline.setScrollValue(page)
    },
  })
}

const setUpStaticComponents = () => {
  const body = document.getElementsByTagName('body')[0]
  body.classList.add('static-mode')
}

const setUpWebSite = () => {
  const animType = checkBrowser()

  switch (animType) {
    case DISPLAY_MODE.ANIMATED:
      return setUpAnimationComponents()
    case DISPLAY_MODE.STATIC:
      return setUpStaticComponents()
  }
}

window.onload = () => {
  setUpWebSite()
}
